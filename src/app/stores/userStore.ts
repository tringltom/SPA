import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";

import { RootStore } from "./rootStore";

const LIMIT = 3;

export default class UserStore {
  refreshTokenTimeout: any;
  rootStore: RootStore;
  user: IUser | null = null;
  users: IUser[] | null = null;
  loading = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.userRegistry.clear();
        this.loadUsers();
      }
    );
  };

  page = 0;
  userCount = 0;
  predicate = new Map();
  userRegistry = new Map();

  get usersArray() {
    return Array.from(this.userRegistry.values());
  }

  setPage = (page: number) => {
    this.page = page;
  };

  get totalPages() {
    return Math.ceil(this.userCount / LIMIT);
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

loadUsers =  async () => {
  try {
    const usersEnvelope = await agent.User.list(this.axiosParams);
    const { users, userCount } = usersEnvelope;
    runInAction(() => {
      users?.forEach((user) => {
        this.userRegistry.set(user.username, user);
      })
      this.userCount = userCount;
    });
  } catch (error) {
    console.log(error);
  }
}

  get isLoggedIn() {
    return !!this.user;
  };

  login = async (values: IUserFormValues) => {
    try {
      this.rootStore.frezeScreen();
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.rootStore.modalStore.closeModal();
      history.push("/arena");
      this.rootStore.unFrezeScreen();
    } catch (error) {
      this.rootStore.unFrezeScreen();
      throw error;
    }
  };

  register = async (values: IUserFormValues) => {
    try {
      this.rootStore.frezeScreen();
      await agent.User.register(values);
      this.rootStore.modalStore.closeModal();
      history.push(`/users/registerSuccess?email=${values.email}`);
      this.rootStore.unFrezeScreen();
    } catch (error) {
      this.rootStore.unFrezeScreen();
      throw error;
    }
  };

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.User.refreshToken();
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {}
  };

  getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      if (user.token != null) 
        this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  logout = async () => {
    try {
      this.rootStore.frezeScreen();
      await agent.User.logout();
      this.rootStore.unFrezeScreen();
    } 
    catch (error) {
      this.rootStore.unFrezeScreen();
    }
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  fbLogin = async (response: any) => {
    this.loading = true;
    try {
      const user = await agent.User.fbLogin(response.accessToken);
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        this.rootStore.modalStore.closeModal();
        this.loading = false;
      });
      history.push("/main");
    } catch (error) {
      this.loading = false;
      throw error;
    }
  };

  recoverPassword = async (email: string) => {
    try {
      this.loading = true;
      const message = await agent.User.recoverPassword(email);
      runInAction(() => {
        this.rootStore.modalStore.closeModal();
        toast.success(message);
        this.loading = false;
      });
      history.push(`/`);
    } catch (error) {
      this.loading = false;
      throw error;
    }
  };

  private startRefreshTokenTimer(user: IUser) {

    const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  };

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  };
}
