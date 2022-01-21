import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export default class FavoriteStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  favoriteRegistry = new Map();
  
  get favoritesArray() {
    return Array.from(this.favoriteRegistry.values());
  }

  createFavoriteForUser = async (userId: number, activityId: number) => {
    try {
        await agent.Favorite.createFavoriteForUser(userId, activityId).then(() => 
            runInAction(() => {
                this.favoriteRegistry.set(activityId, activityId);
            })
        );
      } catch (error) {
        runInAction(() => {
          console.log(error);
        });
      }
  };

  removeFavoriteForUser = async (userId: number, activityId: number) => {
    try {
        await agent.Favorite.removeFavoriteForUser(userId, activityId).then(()=>
            runInAction(() => {
                this.favoriteRegistry.delete(activityId);
            })
        );
      } catch (error) {
        runInAction(() => {
          console.log(error);
        });
      }
  };

  loadFavoriteActivitiesForUser = async (userId: number) => {
    try {
      const favorites = await agent.Favorite.getFavoritesForUser(userId);
      runInAction(() => {
        favorites.forEach((favorite) => {
            this.favoriteRegistry.set(favorite, favorite);
        });
      });
    } catch (error) {
      runInAction(() => {
        console.log(error);
      });
    }
  };
}
