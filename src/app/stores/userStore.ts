import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";

import { RootStore } from "./rootStore";

export default class UserStore {
  refreshTokenTimeout : any;
  rootStore: RootStore;
  user: IUser | null = null;
  loading = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.rootStore.modalStore.closeModal();
      history.push("/main"); //mt add this route and new component
    } catch (error) {
      throw error;
    }
  };

  register = async (values: IUserFormValues) => {
      try {
          await agent.User.register(values);
          this.rootStore.modalStore.closeModal();
          history.push(`/users/registerSuccess?email=${values.email}`)
      } catch (error) {
          throw error;
      }
  }

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.User.refreshToken();
      runInAction(() => {
        this.user = user;
      })
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      
    }
  }

  getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  fbLogin = async (response: any) => {
    this.loading = true;
    try {
      const user = await agent.User.fbLogin(response.accessToken)
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        this.rootStore.modalStore.closeModal();
        this.loading = false;
      })
      history.push('/activities');
    } catch (error) {
      this.loading =false;
      throw error;
    }
    console.log(response);
  }

  private startRefreshTokenTimer(user: IUser) {
    const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}