import { ISkillData, ISkillLevel } from "../models/skillResult";
import { makeAutoObservable, reaction, runInAction } from "mobx";

import { ActivityTypes } from "../models/activity";
import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { toast } from "react-toastify";

const LIMIT = 5;

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;    
    makeAutoObservable(this);   

    reaction(
      () => this.predicate.keys(),
      () => {
        this.pendingActivitiesPage = 0;
        this.pendingActivitiesRegistry.clear();
        this.loadPendingActivitiesForUser();  
        this.approvedActivitiesPage = 0;
        this.approvedActivitiesRegistry.clear();
        this.loadApprovedActivitiesForUser(this.userId);
        this.favoritedActivitiesPage = 0;
        this.favoritedActivitiesRegistry.clear();
        this.loadFavoritedActivitiesForUser(this.userId)
      }
    );
  };

  pendingActivitiesRegistry = new Map();
  approvedActivitiesRegistry = new Map();
  favoritedActivitiesRegistry = new Map();

  pendingActivitiesPage = 0;
  approvedActivitiesPage = 0;
  favoritedActivitiesPage = 0;
  
  predicate = new Map();
  loadingInitial = false;

  pendingActivityCount = 0;
  approvedActivityCount = 0;
  favoritedActivityCount = 0;

  userId = 0;

  skillData : ISkillData | null = null;
  skillMap : Map<string, boolean> = new Map<string, boolean>();
  initialSkillMap : Map<string, boolean> = new Map<string, boolean>();  
  
  get pendingActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.pendingActivitiesPage ? this.pendingActivitiesPage * LIMIT : 0}`);

    this.predicate.forEach((value, key) => {
      if (key.includes("Array"))
      {
        var arrayValue = JSON.parse("[" + value + "]");
        arrayValue.map((el : any) => params.append(key.replace("Array", ""), el))
      }
      else
        params.append(key, value)
    });

    return params;
  }

  get approvedActivityAxiosParams() {
    const params = new URLSearchParams();    
    params.append("limit", String(LIMIT));
    params.append(
      "offset",
      `${this.approvedActivitiesPage ? this.approvedActivitiesPage * LIMIT : 0}`
    );
    this.predicate.forEach((value, key) => {
      if (key.includes("Array")) {        
        var arrayValue = JSON.parse("[" + value + "]");
        arrayValue.map((el: any) =>
          params.append(key.replace("Array", ""), el)
        );
      } else params.append(key, value);
    });
    return params;
  }

  get favoritedActivityAxiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append(
      "offset",
      `${this.favoritedActivitiesPage ? this.favoritedActivitiesPage * LIMIT : 0}`
    );
    this.predicate.forEach((value, key) => {
      if (key.includes("Array")) {
        var arrayValue = JSON.parse("[" + value + "]");
        arrayValue.map((el: any) =>
          params.append(key.replace("Array", ""), el)
        );
      } else params.append(key, value);
    });
    return params;
  }

  get pendingActivitiesArray() {
    return Array.from(this.pendingActivitiesRegistry.values());
  };

  get approvedActivitiesArray() {
    return Array.from(this.approvedActivitiesRegistry.values());
  }

  get favoritedActivitiesArray() {
    return Array.from(this.favoritedActivitiesRegistry.values());
  }

  get totalPendingActivityPages() {
    return Math.ceil(this.pendingActivityCount / LIMIT);
  };

  setUserId = (userId: number) => {
    this.userId = userId;
  }

  setPendingActivitiesPage = (page: number) => {
    this.pendingActivitiesPage = page;
  };

  setApprovedActivitiesPage = (page: number) => {
    this.approvedActivitiesPage = page;
  };

  setFavoritedActivitiesPage = (page: number) => {
    this.favoritedActivitiesPage = page;
  }

  get totalApprovedActivityPages() {
    return Math.ceil(this.approvedActivityCount / LIMIT);
  }

  get totalFavoritedActivitiyPages() {
    return Math.ceil(this.favoritedActivityCount / LIMIT);
  }

  setPredicate = (predicate: string, value: string | Date) => {
    if (this.predicate.has(predicate))
      this.predicate.delete(predicate);
    if (value !== "") {
      this.predicate.set(predicate, value);
    } 
  }

  loadPendingActivitiesForUser = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.PendingActivity.getOwnerPendingActivities(
        this.pendingActivityAxiosParams
      );
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        this.pendingActivitiesRegistry.clear();
        activities.forEach((activity) => {
          this.pendingActivitiesRegistry.set(activity.id, activity);
        });
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

  loadApprovedActivitiesForUser = async (userId: number) => {
    this.loadingInitial = true;
    this.approvedActivitiesRegistry.clear();
    try {
      const approvedActivitiesEnvelope =
        await agent.Activity.getApprovedActivities(
          userId,
          this.approvedActivityAxiosParams
        );
      const { activities, activityCount } = approvedActivitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          this.approvedActivitiesRegistry.set(activity.id, activity);
        });
        this.approvedActivityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  loadFavoritedActivitiesForUser = async (userId: number) => {
    this.loadingInitial = true;
    this.favoritedActivitiesRegistry.clear();
    try {
      const favoritedActivitiesEnvelope =
        await agent.Activity.getFavoritedActivities(
          userId,
          this.favoritedActivityAxiosParams
        );
      const { activities, activityCount } = favoritedActivitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          this.favoritedActivitiesRegistry.set(activity.id, activity);
        });
        this.favoritedActivityCount = activityCount;
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
      await agent.User.updateAbout(about);
      runInAction(() => {
        this.rootStore.userStore.user!.about = about;
        toast.success("Uspešna izmena o korisniku");
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
      await agent.User.updateImage(values.images[0]);
      runInAction(() => {
        toast.success("Uspešna izmena profilne slike, molimo Vas sačekajte odobrenje");
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
        if (ActivityTypes[el + 1] !== undefined) 
          skillLevel.push( {type: key, level: 0} as ISkillLevel)
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