import { makeAutoObservable, runInAction } from "mobx";

import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { IChallengeAnswerForm } from "../models/activity";

const LIMIT = 5;

export default class ChallengeStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  submitting = false;
  
  predicate = new Map();
  challengeAnswersRegistry = new Map();
  challengeApprovalRegistry = new Map();

  loadingInitial = false;

  challengeAnswersPage = 0;
  challengeApprovalPage = 0;

  challengeAnswerCount = 0;
  challengeApprovalCount = 0;

  get challengeAnswerArray() {
    return Array.from(this.challengeAnswersRegistry.values());
  }

  get challengeApprovalArray() {
    return Array.from(this.challengeApprovalRegistry.values());
  }

  setPredicate = (predicate: string, value: string | Date) => {
    if (this.predicate.has(predicate)) this.predicate.delete(predicate);
    if (value !== "") {
      this.predicate.set(predicate, value);
    }
  };

  setChallengeAnswersPage = (page: number) => {
    this.challengeAnswersPage = page;
  };

  setChallengeApprovalPage = (page: number) => {
    this.challengeApprovalPage = page;
  };

  get totalChallengeAnswerPages() {
    return Math.ceil(this.challengeAnswerCount / LIMIT);
  }

  get totalChallengeApprovalPages() {
    return Math.ceil(this.challengeApprovalCount / LIMIT);
  }

  get challengeAnswerAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append(
      "offset",
      `${this.challengeAnswersPage ? this.challengeAnswersPage * LIMIT : 0}`
    );
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  loadChallengeAnswers = async (activityId: string) => {
    this.loadingInitial = true;
    try {
      const challengeAnswersEnvelope =
        await agent.Challenge.getChallengeAnswers(
          activityId,
          this.challengeAnswerAxiosParams
        );
        const { challengeAnswers, challengeAnswerCount } = challengeAnswersEnvelope;
       
      runInAction(() => {
        challengeAnswers.forEach((challengeAnswer) => {
          this.challengeAnswersRegistry.set(
            challengeAnswer.id,
            challengeAnswer
          );
        });
        this.challengeAnswerCount = challengeAnswerCount;
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
      const challengeAnswersEnvelope =
        await agent.Challenge.getChallengeConfirmedAnswers(
            this.challengeAnswerAxiosParams
        );
      const { challenges, challengeCount } = challengeAnswersEnvelope;
      runInAction(() => {
        challenges.forEach((challenge) => {
          this.challengeApprovalRegistry.set(
            challenge.challengeAnswerId,
            challenge
          );
        });
        this.challengeAnswerCount = challengeCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  answerChallenge = async (values: any) => {
    try {
      this.rootStore.frezeScreen();
      this.submitting = true;
      await agent.Challenge.answerChallenge(values.id, {
        description: values.description ?? "",
        images: values.images,
      } as IChallengeAnswerForm);
      runInAction(() => {
        toast.success("Odgovor poslat korisniku");
        this.submitting = false;
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error: any) {
      runInAction(() => {
        this.submitting = false;
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };

  confirmChallengeAnswer = async (id: any) => {
    try {
      this.rootStore.frezeScreen();
      this.submitting = true;
      await agent.Challenge.confirmChallengeAnswer(id);
      runInAction(() => {
        this.challengeAnswersRegistry.forEach((challengeAnswer) => {
          challengeAnswer.confirmed = false;
        });
        this.challengeAnswersRegistry.get(id).confirmed = true;
        toast.success("Uspešno ste odabrali odgovor");
        this.submitting = false;
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error: any) {
      runInAction(() => {
        this.submitting = false;
        this.rootStore.unFrezeScreen();
        this.rootStore.modalStore.closeModal();
        toast.error(error?.data.errors.error);
      });
    }
  };

  approveChallenge = async (challengeAnswerId: string, approve: boolean) => {
    try {
      this.rootStore.frezeScreen();
      if (approve) {
        await agent.Challenge.approveChallengeAnswer(challengeAnswerId);
      } else {
        await agent.Challenge.disapproveChallengeAnswer(challengeAnswerId);
      }
      runInAction(() => {
        toast.success("Uspešno ste odobrili/odbili odgovor na izazov");
        this.challengeApprovalRegistry.delete(challengeAnswerId);
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