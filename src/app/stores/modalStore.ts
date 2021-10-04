import { makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  };

  modal = {
    open: false,
    body: null,
    closeOnDimmerClick : true
  };

  openModal = (content: any, closeOnDimmerClick : boolean = true) => {
    this.modal.open = true;
    this.modal.body = content;
    this.modal.closeOnDimmerClick = closeOnDimmerClick;
  };

  closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
