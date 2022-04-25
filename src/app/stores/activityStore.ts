import { makeAutoObservable, reaction, runInAction } from "mobx";

import { IActivityFormValues } from "../models/activity";
import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { history } from "../..";
import { parseDate } from "../common/form/utils/formUtil";
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

  pendingActivity: IActivityFormValues | null = null;

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

  resetPendingActivitiy = () => {
    this.pendingActivity = null;
  };

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
      await agent.PendingActivity.create(values);
      runInAction(() => {
        this.rootStore.userStore.user?.activityCounts.map(ac => (ac.type === values.type ? ac.available-- : ac));
        history.push("/arena");
        toast.success("Uspešno kreiranje, molimo Vas da sačekate odobrenje");
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      throw error;
    }
  };

  update = async (activityId : string, values: IActivityFormValues) => {
    try {

      this.rootStore.frezeScreen();
      await agent.PendingActivity.update(activityId, values);
      runInAction(() => {
        history.push("/arena");
        toast.success("Uspešna izmena, molimo Vas da sačekate odobrenje");
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      throw error;
    }
  };

  getOwnerPendingActivity = async (id: string) => {
    this.loadingInitial = true;
    this.rootStore.frezeScreen();
    try {
      const pendingActivity = await agent.PendingActivity.getOwnerPendingActivity(id);
      runInAction(async () => {
        let promises = await pendingActivity.urls.map((el: RequestInfo) => fetch(el).then(r => r.blob()));
        Promise.all(promises).then((res) => {
          runInAction(() => {
          if (res.length > 0) pendingActivity.images = res as Blob[];
          pendingActivity.dateStart = parseDate(pendingActivity.startDate ?? "");
          pendingActivity.timeStart = parseDate(pendingActivity.startDate ?? "");
          pendingActivity.dateEnd = parseDate(pendingActivity.endDate ?? "");
          pendingActivity.timeEnd = parseDate(pendingActivity.endDate ?? "");
          this.pendingActivity = pendingActivity as IActivityFormValues;
          this.rootStore.unFrezeScreen();
          this.loadingInitial = false;
          })
        })
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.loadingInitial = false;
    }
  }

  loadPendingActivities = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.PendingActivity.getPendingActivities(
        this.pendingActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
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
      
      if (approve)
        await agent.Activity.approvePendingActivity(activityId);
      else
        await agent.PendingActivity.dissaprove(activityId);
        
      toast.success("Uspešno ste odobrili/odbili aktivnost");
      this.pendingActivitiesRegistry.delete(activityId);
    
      this.rootStore.modalStore.closeModal();
      this.rootStore.unFrezeScreen();
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      console.log(error);
      toast.error("Neuspešno, proverite konzolu");
    }
  }

  getApprovedActivitiesFromOtherUsers = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activity.getActivitiesFromOtherUsers(
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
