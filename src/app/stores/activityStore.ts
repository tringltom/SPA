import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivityFormValues } from "../models/activity";
import { RootStore } from "./rootStore";
import { history } from "../..";
import { toast } from "react-toastify";
import { setActivityProps } from "../common/utils/commonUtil";

const LIMIT = 5;

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.pendingActivitiesPage = 0;
        this.approvedActivitiesPage = 0;
        this.pendingActivitiesRegistry.clear();
        this.approvedActivitiesRegistry.clear();
        this.loadPendingActivities();
      }
    );
  }
  submitting = false;
  pendingActivitiesRegistry = new Map();
  approvedActivitiesRegistry = new Map();
  pendingActivitiesPage = 0;
  approvedActivitiesPage = 0;
  predicate = new Map();
  loadingInitial = false;
  pendingActivityCount = 0;
  approvedActivityCount = 0;

  get pendingActivitiesArray() {
    return Array.from(this.pendingActivitiesRegistry.values());
  }

  get approvedActivitiesArray() {
    return Array.from(this.approvedActivitiesRegistry.values());
  }

  setPendingActivitiesPage = (page: number) => {
    this.pendingActivitiesPage = page;
  };

  setApprovedActivitiesPage = (page: number) => {
    this.approvedActivitiesPage = page;
  };

  get totalPendingActivityPages() {
    return Math.ceil(this.pendingActivityCount / LIMIT);
  }

  get totalApprovedActivityPages() {
    return Math.ceil(this.approvedActivityCount / LIMIT);
  }

  get pendingActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.pendingActivitiesPage ? this.pendingActivitiesPage * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  get approvedActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.approvedActivitiesPage ? this.approvedActivitiesPage * LIMIT : 0}`);
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
        this.pendingActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.pendingActivitiesRegistry.set(activity.id, activity);
        });
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

  approvePendingActivity = async (activityId : string, approve : boolean) => {
    try {
      this.rootStore.frezeScreen();
      console.log(approve);
      const success = await agent.Activity.resolvePendingActivity(activityId, approve);
      if (success){
        toast.success("Uspešno ste odobrili/odbili aktivnost");
        this.pendingActivitiesRegistry.delete(activityId);
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

  loadApprovedActivitiesExcludingUser = async (userId: number) => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activity.loadApprovedActivitiesExcludingUser(
        userId,
        this.approvedActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          this.approvedActivitiesRegistry.set(activity.id, activity);
        });
        this.approvedActivityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    };
  }
}
