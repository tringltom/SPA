import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivityFormValues } from "../models/activity";
import { RootStore } from "./rootStore";
import { history } from "../..";
import { toast } from "react-toastify";

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
          this.loadActivities();
      }
  )
  }
  submitting = false;
  activityRegistry = new Map();
  page = 0;
  predicate = new Map();
  loadingInitial = false;
  activityCount = 0;

  get activitiesArray() {
    return Array.from(this.activityRegistry.values());
  };

  setPage = (page: number) => {
    this.page = page;
  };

  get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        console.log(key, value);
        params.append(key, value.toISOString());
      } else {
        console.log(key, value);
        params.append(key, value);
      }
    });
    return params;
  };

  create = async (values: IActivityFormValues) => {
    try {
      this.submitting = true;
      const message = await agent.Activity.create(values);
      runInAction(() => {
        this.submitting = false;
        history.push("/arena");
        toast.success(message);
        this.rootStore.modalStore.closeModal();
      });
    } catch (error) {
      this.submitting = false;
      toast.error("Nažalost došlo je do greške, molimo Vas pokušajte ponovo ili kontaktirajte podršku");
    }
  };

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
        const activitiesEnvelope = await agent.Activity.getPendingActivities(this.axiosParams);
        const {activities, activityCount} = activitiesEnvelope
        runInAction(() => {
            activities.forEach((activity) => {
                this.activityRegistry.set(activity.id, activity);
            });
            this.activityCount = activityCount;
            this.loadingInitial = false
        })
    } catch (error) {
        runInAction(() => {
            console.log(error);
            this.loadingInitial = false
        })
    }
};
}
