import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this);
  };

  @observable.shallow modal = {
    open: false,
    body: null,
    closeOnDimmerClick : true,
    fixedWidth : false
  };

  @action openModal = (content: any, closeOnDimmerClick : boolean = true, fixedWidth : boolean = false) => {
    this.modal.open = true;
    this.modal.body = content;
    this.modal.closeOnDimmerClick = closeOnDimmerClick;
    this.modal.fixedWidth = fixedWidth;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
