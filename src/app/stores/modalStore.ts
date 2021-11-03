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
    closeOnDimmerClick : true
  };

  @action openModal = (content: any, closeOnDimmerClick : boolean = true) => {
    this.modal.open = true;
    this.modal.body = content;
    this.modal.closeOnDimmerClick = closeOnDimmerClick;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
