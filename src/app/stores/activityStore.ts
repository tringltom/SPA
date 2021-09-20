import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivityFormValues } from "../models/activity";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  };

  create = async (values: IActivityFormValues) => {
    try {
        console.log(values);
      await agent.Activity.create(values);
        runInAction(() => {
        history.push("/arena");      
    });
    } catch (error) {
      throw error;
    }
  };
}
