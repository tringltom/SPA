import { configure } from "mobx";
import { createContext } from "react";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";

configure({ enforceActions: "always" });

export class RootStore {
  userStore: UserStore;
  modalStore: ModalStore;
  commonStore: CommonStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
    this.commonStore = new CommonStore(this);
  };
};

export const RootStoreContext = createContext(new RootStore());
