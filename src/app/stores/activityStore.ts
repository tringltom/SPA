import { IActivity, IActivityFormValues, IChallengeAnswerForm } from "../models/activity";
import { makeAutoObservable, reaction, runInAction } from "mobx";

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
        this.approvedActivitiesPage = 0;
        this.approvedActivitiesRegistry.clear();
        this.getApprovedActivitiesFromOtherUsers();
      }
    );
  }

  submitting = false;
  pendingActivitiesRegistry = new Map();
  approvedActivitiesRegistry = new Map();
  pendingHappeningActivitiesRegistry = new Map();
  challengeAnswersRegistry = new Map();
  challengeApprovalRegistry = new Map();

  pendingActivitiesPage = 0;
  approvedActivitiesPage = 0;
  pendingHappeningActivitiesPage = 0;
  challengeAnswersPage = 0;
  challengeApprovalPage= 0;

  predicate = new Map();
  loadingInitial = false;

  pendingActivityCount = 0;
  approvedActivityCount = 0;
  pendingHappeningActivityCount = 0;
  challengeAnswerCount = 0;
  challengeApprovalCount = 0;

  pendingActivity: IActivityFormValues | null = null;
  approvedActivity: IActivity | null = null;

  get pendingActivitiesArray() {
    return Array.from(this.pendingActivitiesRegistry.values());
  };

  resetPendingActivitiesArray = () => {
    this.pendingActivitiesRegistry = new Map();
  };

  get approvedActivitiesArray() {
    return Array.from(this.approvedActivitiesRegistry.values());
  };

  get pendingHappeningActivitiesArray() {
    return Array.from(this.pendingHappeningActivitiesRegistry.values());
  };

  get challengeAnswerArray() {
    return Array.from(this.challengeAnswersRegistry.values());
  };

  get challengeApprovalArray() {
    return Array.from(this.challengeApprovalRegistry.values());
  };

  setPendingActivitiesPage = (page: number) => {
    this.pendingActivitiesPage = page;
  };

  setApprovedActivitiesPage = (page: number) => {
    this.approvedActivitiesPage = page;
  };

  setPendingHappeningActivitiesPage = (page: number) => {
    this.pendingHappeningActivitiesPage = page;
  };

  setChallengeAnswersPage = (page: number) => {
    this.challengeAnswersPage = page;
  };

  setChallengeApprovalPage = (page: number) => {
    this.challengeApprovalPage = page;
  };

  get totalPendingActivityPages() {
    return Math.ceil(this.pendingActivityCount / LIMIT);
  };

  get totalApprovedActivityPages() {
    return Math.ceil(this.approvedActivityCount / LIMIT);
  };

  get totalPendingHappeningActivitiesPages() {
    return Math.ceil(this.pendingHappeningActivityCount / LIMIT);
  };

  get totalChallengeAnswerPages() {
    return Math.ceil(this.challengeAnswerCount / LIMIT);
  };

  get totalChallengeApprovalPages() {
    return Math.ceil(this.challengeApprovalCount / LIMIT);
  };

  resetPendingActivity = () => {
    this.pendingActivity = null;
  };

  resetApprovedActivity = () => {
    this.approvedActivity = null;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    if (this.predicate.has(predicate))
      this.predicate.delete(predicate);
    if (value !== "") {
      this.predicate.set(predicate, value);
    } 
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
  };

  get approvedActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.approvedActivitiesPage ? this.approvedActivitiesPage * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key.includes("Array"))
      {
        var arrayValue = JSON.parse("[" + value + "]");
        arrayValue.map((el : any) => params.append(key.replace("Array", ""), el))
      }
      else
        params.append(key, value)
    });
    return params;
  };

  get pendingHappeningActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.pendingActivitiesPage ? this.pendingActivitiesPage * LIMIT : 0}`);
    this.predicate.forEach((value, key) => params.append(key, value));
    return params;
  };

  getApprovedActivity = async (id: string) => {
    try {
      this.loadingInitial = true;
      var activity = await agent.Activity.getActivity(id);
      runInAction(() => {
        this.approvedActivity = activity;
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      this.loadingInitial = false;
    }
  };

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
  };

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

  loadPendingHappeningActivities = async () => {
    this.loadingInitial = true;
    try {
      const happeningEnvelope = await agent.Activity.getHappeningsForApproval(
        this.pendingActivityAxiosParams
      );
      const { happenings, happeningCount } = happeningEnvelope;
      runInAction(() => {
        happenings.forEach((happening) => {
          this.pendingHappeningActivitiesRegistry.set(happening.id, happening);
        });
        this.pendingActivityCount = happeningCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  loadChallengeAnswers = async (activityId: string) => {
    this.loadingInitial = true;
    try {
      const challengeAnswersEnvelope = await agent.Activity.getChallengeAnswers(
        activityId,
        this.pendingActivityAxiosParams
      );
      const { challengeAnswers, challengeAnswerCount } = challengeAnswersEnvelope;
      runInAction(() => {
        challengeAnswers.forEach((challengeAnswer) => {
          this.challengeAnswersRegistry.set(challengeAnswer.id, challengeAnswer);
        });
        this.pendingActivityCount = challengeAnswerCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  loadChallengeConfirmedAnswers = async () => {
    this.loadingInitial = true;
    try {
      const challengeAnswersEnvelope = await agent.Activity.getChallengeConfirmedAnswers(
        this.pendingActivityAxiosParams
      );
      const { challenges, challengeCount } = challengeAnswersEnvelope;
      runInAction(() => {
        challenges.forEach((challenge) => {
          this.challengeApprovalRegistry.set(challenge.challengeAnswerId, challenge);
        });
        this.pendingActivityCount = challengeCount;
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

      if (approve) await agent.Activity.approvePendingActivity(activityId);
      else await agent.PendingActivity.dissaprove(activityId);

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
  };

  getApprovedActivitiesFromOtherUsers = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activity.getActivitiesFromOtherUsers(
        this.approvedActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      console.log(activities)
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
  };

  answerPuzzle = async (values: any) => {
    try {
      this.rootStore.frezeScreen();
      this.submitting = true;
      const result = await agent.Activity.answerPuzzle(
        values.id,
        values.answer
      );
      runInAction(() => {
        toast.success(
          `Tačan odogovor, osvojili ste ${result} iskustvenih poena!`
        );
        this.submitting = false;
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error : any) {
      runInAction(() => {
        this.submitting = false;
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };

  answerChallenge = async (values: any) => {
    try {
      this.rootStore.frezeScreen();
      this.submitting = true;
      await agent.Activity.answerChallenge(
        values.id,
        { description: values.description ?? "",
          images:  values.images} as IChallengeAnswerForm
      );
      runInAction(() => {
        toast.success(
          'Odgovor poslat korisniku'
        );
        this.submitting = false;
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error : any) {
      runInAction(() => {
        this.submitting = false;
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };

  confirmChallengeAnswer= async (id: any) => {
    try {
      this.rootStore.frezeScreen();
      this.submitting = true;
      await agent.Activity.confirmChallengeAnswer(
        id
      );
      runInAction(() => {
        this.challengeAnswersRegistry.forEach((challengeAnswer) => {
          challengeAnswer.confirmed = false;
        });
        this.challengeAnswersRegistry.get(id).confirmed = true;
        toast.success(
          'Uspešno ste odabrali odgovor'
        );
        this.submitting = false;
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error : any) {
      runInAction(() => {
        this.submitting = false;
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };

  attendToHappening = async (id: string) => {
    try {
      this.submitting = true;
      await agent.Activity.attendToHappening(id);
      runInAction(() => {
        this.submitting = false;
      });
    } catch (error : any) {
      runInAction(() => {
        console.log(error)
        this.submitting = false;
        toast.error(error?.data.errors.error);
      });
    }
  };

  cancelAttendenceToHappening = async (id: string) => {
    try {
      this.submitting = true;
      await agent.Activity.cancelAttendenceToHappening(id);
      runInAction(() => {
        this.submitting = false;
      });
    } catch (error : any) {
      runInAction(() => {
        this.submitting = false;
        toast.error(error?.data.errors.error);
      });
    }
  };

  completeHappening = async (id : string, values: any) => {
    try {
      this.rootStore.frezeScreen();
      await agent.Activity.completeHappening(id, values.images);
      runInAction(() => {
        toast.success("Uspešan završetak dogadjaja, Molimo Vas sačekajte potvrdu");
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

  approveHappening = async (activityId : string, approve : boolean) => {
    try {
      this.rootStore.frezeScreen();
      await agent.Activity.approveHappening(activityId, approve);
      runInAction(() => {
        toast.success("Uspešno ste odobrili/odbili događaj");
        this.pendingHappeningActivitiesRegistry.delete(activityId);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      }); 
    } catch (error : any) {
      runInAction(() => {
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      }); 
    }
  };

  approveChallenge = async (challengeAnswerId : string, approve : boolean) => {
    try {
      this.rootStore.frezeScreen();
      if (approve) {
        await agent.Activity.approveChallengeAnswer(challengeAnswerId);
      } else {
        await agent.Activity.disapproveChallengeAnswer(challengeAnswerId);
      }
      runInAction(() => {
        toast.success("Uspešno ste odobrili/odbili odgovor na izazov");
        this.challengeApprovalRegistry.delete(challengeAnswerId);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      }); 
    } catch (error : any) {
      runInAction(() => {
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      }); 
    }
  };
}
