import { configure, makeAutoObservable, runInAction } from "mobx";

import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import FavoriteStore from "./favoriteStore";
import HubStore from "./Hub";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import ReviewStore from "./reviewStore";
import UserStore from "./userStore";
import agent from "../api/agent";
import { createContext } from "react";
import { toast } from "react-toastify";
import ChallengeStore from "./challengeStore";
import HappeningStore from "./happeningStore";

configure({ enforceActions: "always" });

export class RootStore {
  userStore: UserStore;
  modalStore: ModalStore;
  commonStore: CommonStore;
  activityStore: ActivityStore;
  reviewStore: ReviewStore;
  favoriteStore: FavoriteStore;
  profileStore: ProfileStore;
  challengeStore: ChallengeStore;
  happeningStore: HappeningStore;
  hubStore: HubStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.modalStore = new ModalStore(this);
    this.commonStore = new CommonStore(this);
    this.activityStore = new ActivityStore(this);
    this.reviewStore = new ReviewStore(this);
    this.favoriteStore = new FavoriteStore(this);
    this.profileStore = new ProfileStore(this);
    this.challengeStore = new ChallengeStore(this);
    this.happeningStore = new HappeningStore(this);
    this.hubStore = new HubStore(this);
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

  getPrize = async () => { 
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
