import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { IActivity } from "../models/activity";
import { toast } from "react-toastify";

const LIMIT = 5;

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);    
  };

  loadingInitial = false;
  pendingActivitiesPage = 0;
  pendingActivitiesRegistry = [] as IActivity[];
  pendingActivityCount = 0;

  
  get pendingActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.pendingActivitiesPage ? this.pendingActivitiesPage * LIMIT : 0}`);
    return params;
  }

  get pendingActivitiesArray() {
    return Array.from(this.pendingActivitiesRegistry.values());
  };

  get totalPendingActivityPages() {
    return Math.ceil(this.pendingActivityCount / LIMIT);
  };

  setPendingActivitiesPage = (page: number) => {
    this.pendingActivitiesPage = page;
  };

  loadPendingActivitiesForUser = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activity.getPendingActivitiesForUser(
        this.pendingActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        this.pendingActivitiesRegistry = activities;
        this.pendingActivityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  setUserAbout = async (about: string) => {
    try {
      this.rootStore.frezeScreen();
      const message = await agent.User.updateAbout(about);
      runInAction(() => {
        this.rootStore.userStore.user!.about = about;
        toast.success(message);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      toast.error("Neuspešna izmena");
    }
  };

};