import { configure, makeAutoObservable } from "mobx";
import { createContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

configure({ enforceActions: "always" });

export class RootStore {
  userStore: UserStore;
  modalStore: ModalStore;
  commonStore: CommonStore;
  activityStore: ActivityStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    makeAutoObservable(this);
  };

  allowEvents = true;
  
  frezeScreen = () => {
    this.allowEvents =  false;
  };

  unFrezeScreen = () => {
    this.allowEvents =  true;
  };

};

export const RootStoreContext = createContext(new RootStore());
