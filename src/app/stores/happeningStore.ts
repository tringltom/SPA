import { makeAutoObservable, runInAction } from "mobx";

import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { IChallengeAnswerForm } from "../models/activity";

const LIMIT = 5;

export default class HappeningStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  submitting = false;

  predicate = new Map();
  pendingHappeningActivitiesRegistry = new Map();

  loadingInitial = false;

  pendingHappeningActivitiesPage = 0;

  pendingHappeningActivityCount = 0;


  setPredicate = (predicate: string, value: string | Date) => {
    if (this.predicate.has(predicate)) this.predicate.delete(predicate);
    if (value !== "") {
      this.predicate.set(predicate, value);
    }
  };

  get pendingHappeningActivitiesArray() {
    return Array.from(this.pendingHappeningActivitiesRegistry.values());
  }

  setPendingHappeningActivitiesPage = (page: number) => {
    this.pendingHappeningActivitiesPage = page;
  };

  get totalPendingHappeningActivitiesPages() {
    return Math.ceil(this.pendingHappeningActivityCount / LIMIT);
  }

  get pendingHappeningActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append(
      "offset",
      `${this.rootStore.activityStore.pendingActivitiesPage ? this.rootStore.activityStore.pendingActivitiesPage * LIMIT : 0}`
    );
    this.predicate.forEach((value, key) => params.append(key, value));
    return params;
  }

  loadPendingHappeningActivities = async () => {
    this.loadingInitial = true;
    try {
      const happeningEnvelope = await agent.Happening.getHappeningsForApproval(
        this.rootStore.activityStore.pendingActivityAxiosParams
      );
      const { happenings, happeningCount } = happeningEnvelope;
      runInAction(() => {
        happenings.forEach((happening) => {
          this.pendingHappeningActivitiesRegistry.set(happening.id, happening);
        });
        //this.pendingActivityCount = happeningCount;
        this.rootStore.activityStore.pendingActivityCount = happeningCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  attendToHappening = async (id: string) => {
    try {
      this.submitting = true;
      await agent.Happening.attendToHappening(id);
      runInAction(() => {
        this.submitting = false;
      });
    } catch (error: any) {
      runInAction(() => {
        console.log(error);
        this.submitting = false;
        toast.error(error?.data.errors.error);
      });
    }
  };

  cancelAttendenceToHappening = async (id: string) => {
    try {
      this.submitting = true;
      await agent.Happening.cancelAttendenceToHappening(id);
      runInAction(() => {
        this.submitting = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.submitting = false;
        toast.error(error?.data.errors.error);
      });
    }
  };

  completeHappening = async (id: string, values: any) => {
    try {
      this.rootStore.frezeScreen();
      await agent.Happening.completeHappening(id, values.images);
      runInAction(() => {
        toast.success(
          "Uspešan završetak događaja, Molimo Vas sačekajte potvrdu"
        );
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error: any) {
      runInAction(() => {
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };

  approveHappening = async (activityId: string, approve: boolean) => {
    try {
      this.rootStore.frezeScreen();
      await agent.Happening.approveHappening(activityId, approve);
      runInAction(() => {
        toast.success("Uspešno ste odobrili/odbili događaj");
        this.pendingHappeningActivitiesRegistry.delete(activityId);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error: any) {
      runInAction(() => {
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };
}