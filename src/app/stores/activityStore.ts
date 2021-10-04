import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivityFormValues } from "../models/activity";
import { RootStore } from "./rootStore";
import { history } from "../..";
import { toast } from "react-toastify";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }
  submitting = false;

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
}
