import { ActivityTypes, IActivity, IPendingActivity } from "../models/activity";
import { ISkillData, ISkillLevel } from "../models/skillResult";
import { makeAutoObservable, runInAction } from "mobx";

import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { toast } from "react-toastify";

const LIMIT = 5;

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);    
  };

  loadingInitial = false;
  pendingActivitiesPage = 0;
  pendingActivitiesRegistry = [] as IPendingActivity[];
  pendingActivityCount = 0;
  skillData : ISkillData | null = null;
  skillMap : Map<string, boolean> = new Map<string, boolean>();
  initialSkillMap : Map<string, boolean> = new Map<string, boolean>();
  
  get pendingActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.pendingActivitiesPage ? this.pendingActivitiesPage * LIMIT : 0}`);
    return params;
  }

  get pendingActivitiesArray() {
    return Array.from(this.pendingActivitiesRegistry.values());
  };

  get totalPendingActivityPages() {
    return Math.ceil(this.pendingActivityCount / LIMIT);
  };

  setPendingActivitiesPage = (page: number) => {
    this.pendingActivitiesPage = page;
  };

  loadPendingActivitiesForUser = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.PendingActivity.getOwnerPendingActivities(
        this.pendingActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        this.pendingActivitiesRegistry = activities;
        this.pendingActivityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  setUserAbout = async (about: string) => {
    try {
      this.rootStore.frezeScreen();
      const message = await agent.User.updateAbout(about);
      runInAction(() => {
        this.rootStore.userStore.user!.about = about;
        toast.success(message);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      toast.error("Neuspešna izmena");
    }
  };

  setUserImage = async (values: any) => {
    try {
      this.rootStore.frezeScreen();
      const message = await agent.User.updateImage(values.images[0]);
      runInAction(() => {
        toast.success(message);
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      this.rootStore.unFrezeScreen();
      this.rootStore.modalStore.closeModal();
      toast.error("Neuspešna izmena");
    }
  };

  loadSkills = async (userId : number) => {
    this.loadingInitial = true;
    try {
      const skillData = await agent.Profile.getSkills(userId);
      runInAction(() => {
        this.skillData = skillData;
        this.setInitialToggleMap();
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Neuspešno dostavljanje podataka");
        this.loadingInitial = false;
      });
    }
  };

  setInitialToggleMap = () => {
    
    var toggleMapstate = new Map<string, boolean>();
    var initialtoggleMapstate = new Map<string, boolean>();

    Object.keys(ActivityTypes).forEach((key: any, el) => {
      if (ActivityTypes[el + 1] !== undefined) {
        for (let index = 1; index <= 7; index++) {
          this.skillData?.skillLevels.forEach((sl) => {
            if (sl.type.toString() === key.toString()) {
              if (index <= sl.level) {
                toggleMapstate.set(key + " " + index, true);
                initialtoggleMapstate.set(key + " " + index, true);
              } 
              else 
              toggleMapstate.set(key + " " + index, false);
            }
          });
        }
      }
    });

    this.skillMap = toggleMapstate;
    this.initialSkillMap = initialtoggleMapstate;
  };

  resetSkills = async () => {
    this.rootStore.frezeScreen();
    try {
      const skillLevel : ISkillLevel[] = [];
      
      Object.keys(ActivityTypes).forEach((key: any, el) => {
        if (ActivityTypes[el + 1] !== undefined) {
        console.log(key)
        skillLevel.push( {type: key, level: 1} as ISkillLevel)
        }
      });

      const skillData: ISkillData = {
        currentLevel: Number(this.rootStore.userStore.user!.currentLevel),
        xpLevel: Number(this.rootStore.userStore.user!.currentLevel),
        skillLevels : skillLevel,
      };

      const updatedUser = await agent.Profile.updateSkills(skillData);
      runInAction(() => {
        this.setResetToggleMap();
        this.skillData!.currentLevel = 1;
        this.rootStore.userStore.user!.currentLevel = updatedUser.currentLevel;
        this.rootStore.userStore.user!.activityCounts = updatedUser.activityCounts;
        this.rootStore.userStore.user!.userName = updatedUser.userName;
        toast.success("Uspešno ste poništili vaše odabrane poene");
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Neuspešno poništavanje");
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    }
  };

  setResetToggleMap = () => {
    
    var toggleMapstate = new Map<string, boolean>();

    Object.keys(ActivityTypes).forEach((key: any, el) => {
      if (ActivityTypes[el + 1] !== undefined) {
        for (let index = 1; index <= 7; index++) {
          this.skillData?.skillLevels.forEach(() => {
              toggleMapstate.set(key + " " + index, false);
          });
        }
      }
    });
    
    this.skillMap = toggleMapstate;
    this.initialSkillMap = toggleMapstate;
  };

  updateSkills = async (skillData : ISkillData) => {
    this.rootStore.frezeScreen();
    try {
      const updatedUser = await agent.Profile.updateSkills(skillData);
      runInAction(() => {
        this.skillData = skillData;
        this.setInitialToggleMap();
        this.rootStore.userStore.user!.currentLevel = updatedUser.currentLevel;
        this.rootStore.userStore.user!.activityCounts = updatedUser.activityCounts;
        this.rootStore.userStore.user!.userName = updatedUser.userName;
        toast.success("Uspešno ste izabrali dodatne poene");
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    } catch (error) {
      runInAction(() => {
        toast.error("Neuspešan obabir");
        this.rootStore.modalStore.closeModal();
        this.rootStore.unFrezeScreen();
      });
    }
  };

};