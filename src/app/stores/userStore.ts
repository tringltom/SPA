import { IUser, IUserFormValues } from "../models/user";
import { makeAutoObservable, reaction, runInAction } from "mobx";

import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";

const LIMIT = 3;

export default class UserStore {
  refreshTokenTimeout: any;
  rootStore: RootStore;
  user: IUser | null = null;
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
  userImageCount = 0;
  predicate = new Map();
  userRegistry = new Map();
  userImageRegistry = new Map();

  get usersArray() {
    return Array.from(this.userRegistry.values());
  }

  get userImagestoApproveArray() {
    return Array.from(this.userImageRegistry.values());
  }

  setPage = (page: number) => {
    this.page = page;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    if (this.predicate.has(predicate)) 
      this.predicate.delete(predicate);
    if (value !== "") {
      this.predicate.set(predicate, value);
    }
  }

  get totalPages() {
    return Math.ceil(this.userCount / LIMIT);
  }

  get isLoggedIn() {
    return !!this.user;
  };

  get userId() {
    return this.user?.id;
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
        params.append(key, value);
    });
    return params;
  }

  loadUsers = async () => {
    try {
      const usersEnvelope = await agent.User.getRankedUsers(this.axiosParams);
      const { users, userCount } = usersEnvelope;
      runInAction(() => {
        users?.forEach((user) => {
          this.userRegistry.set(user.userName, user);
        });
        this.userCount = userCount;
      });
    } catch (error) {
      console.log(error);
    }
  }

  loadUsersForImageApproval = async () => {
    try {
      const usersImageEnvelope = await agent.User.getImagesForApproval(this.axiosParams);
      const { users, userCount } = usersImageEnvelope;
      runInAction(() => {
        users?.forEach((user) => {
          this.userImageRegistry.set(user.id, user);
        });
        this.userImageCount = userCount;
      });
    } catch (error) {
      console.log(error);
    }
  };

  approveUserImage = async (userId : string, approve : boolean) => {
    try {
      this.rootStore.frezeScreen();
      await agent.User.resolveImage(userId, approve);   
      toast.success("Uspešno ste odobrili/odbili profilnu sliku");
      this.userImageRegistry.delete(userId); 
      this.rootStore.modalStore.closeModal();
      this.rootStore.unFrezeScreen();
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      console.log(error);
      toast.error("Neuspešno, proverite konzolu");
    }
  }

  login = async (values: IUserFormValues) => {
    try {
      this.rootStore.frezeScreen();
      const user = await agent.Session.login(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.showDice = user.isDiceRollAllowed;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.rootStore.modalStore.closeModal();
      history.push("/arena", "/");
      this.rootStore.unFrezeScreen();
    } catch (error) {
      this.rootStore.unFrezeScreen();
      throw error;
    }
  };

  register = async (values: IUserFormValues) => {
    try {
      this.rootStore.frezeScreen();
      await agent.Session.register(values);
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
      const user = await agent.Session.refreshToken();
      runInAction(() => {
        this.user!.token = user.token
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {}
  };

  getUser = async () => {
    try {
      const user = await agent.Session.current();
      runInAction(() => {
        this.user = user;
        this.rootStore.showDice = user.isDiceRollAllowed;
      });
      this.rootStore.commonStore.setToken(user.token);
      if (user.token != null) 
        this.startRefreshTokenTimer(user);
    } catch (error) {}
  };

  logout = async () => {
    try {
      this.rootStore.frezeScreen();
      await agent.Session.logout();
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
      const user = await agent.Session.fbLogin(response.accessToken);
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
      await agent.Session.sendRecoverPassword(email);
      runInAction(() => {
        this.rootStore.modalStore.closeModal();
        toast.success("Molimo proverite Vaše poštansko sanduče kako biste uneli novu šifru");
        this.loading = false;
      });
      history.push(`/`);
    } catch (error) {
      this.loading = false;
      throw error;
    }
  };

  verifyPasswordRecovery = async (token: string, email: string, newPassword: string) => {
    try {
      this.loading = true;
      await agent.Session.verifyPasswordRecovery(token, email, newPassword);
      runInAction(() => {
        this.rootStore.modalStore.closeModal();
        toast.success("Uspešna izmena šifre, molimo Vas da se ulogujete sa novim kredencijalima");
        this.loading = false;
      });
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
