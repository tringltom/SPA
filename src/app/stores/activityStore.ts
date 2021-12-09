import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivityFormValues } from "../models/activity";
import { RootStore } from "./rootStore";
import { history } from "../..";
import { toast } from "react-toastify";
import { setActivityProps } from "../common/utils/util";

const LIMIT = 5;

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadPendingActivities();
      }
    );
  }
  submitting = false;
  activityRegistry = new Map();
  page = 0;
  predicate = new Map();
  loadingInitial = false;
  activityCount = 0;

  get activitiesArray() {
    return Array.from(this.activityRegistry.values());
  }

  setPage = (page: number) => {
    this.page = page;
  };

  get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
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

  create = async (values: IActivityFormValues) => {
    try {
      this.rootStore.frezeScreen();
      const message = await agent.Activity.create(values);
      runInAction(() => {
        history.push("/arena");
        toast.success(message);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      throw error;
    }
  };

  loadPendingActivities = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activity.getPendingActivities(
        this.axiosParams
      );
      console.log(activitiesEnvelope);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  approvePendingActivity = async (activityId : string, approve : boolean) => {
    try {
      this.rootStore.frezeScreen();
      console.log(approve);
      const success = await agent.Activity.resolvePendingActivity(activityId, approve);
      if (success){
        toast.success("Uspešno ste odobrili/odbili aktivnost");
        this.activityRegistry.delete(activityId);
      } else{
        toast.error("Neuspešno ste odobrili/odbili aktivnost");
      }      
      this.rootStore.modalStore.closeModal();
      this.rootStore.unFrezeScreen();
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      console.log(error);
      toast.error("Neuspešno, proverite konzolu");
    }
  }
}
