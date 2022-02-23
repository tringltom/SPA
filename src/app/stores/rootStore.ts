import { configure, makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import UserStore from "./userStore";
import agent from "../api/agent";
import { toast } from "react-toastify";
import ReviewStore from "./reviewStore";
import FavoriteStore from "./favoriteStore";
import ProfileStore from "./profileStore";

configure({ enforceActions: "always" });

export class RootStore {
  userStore: UserStore;
  modalStore: ModalStore;
  commonStore: CommonStore;
  activityStore: ActivityStore;
  reviewStore: ReviewStore;
  favoriteStore: FavoriteStore;
  profileStore: ProfileStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    this.reviewStore = new ReviewStore(this);
    this.favoriteStore = new FavoriteStore(this);
    this.profileStore = new ProfileStore(this);
    makeAutoObservable(this);
  };

  allowEvents = true;
  shake = false;
  showDice = true;
  
  frezeScreen = () => {
    this.allowEvents =  false;
  };

  unFrezeScreen = () => {
    this.allowEvents =  true;
  };

  getPrice = async () => { 
      this.shake = true;
      setTimeout(async () => {
        try {
          this.frezeScreen();
          const diceResult = await agent.Dice.roll();
          runInAction(() => {
            this.shake = false;
            this.showDice = false;
            this.unFrezeScreen();
            toast.info(`${diceResult.result}: ${diceResult.message}`);
          });
          
        } catch (error) {
          runInAction(() => {
            this.shake = false;
            this.showDice = false;
            this.unFrezeScreen();
          });
        }
      }, 2000);
  };

};
export const RootStoreContext = createContext(new RootStore());
