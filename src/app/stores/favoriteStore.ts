import { makeAutoObservable, runInAction } from "mobx";

import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class FavoriteStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  favoriteRegistry = new Map();
  loading = false;
  resolvingFavourite = false;  

  get favoritesArray() {
    return Array.from(this.favoriteRegistry.values());
  }

  resolveFavoriteActivity = async (activityId: number, favorite: boolean) => {
    this.resolvingFavourite = true;
    try {
      if(favorite)
        await agent.Favorite.createFavoriteActivity(activityId);
      else
        await agent.Favorite.removeFavoriteActivity(activityId);
      runInAction(() => {
        favorite
          ? this.favoriteRegistry.set(activityId, activityId)
          : this.favoriteRegistry.delete(activityId);
        this.resolvingFavourite = false;
      });
    } catch (error) {
      toast.error("Došlo je do problema sa dodelom u omiljene aktivnosti");
      this.resolvingFavourite = false;
    }
  };

  loadFavoriteActivities = async () => {
    this.loading = true;
    try {
      const favorites = await agent.Favorite.getOwnerFavoriteActivityIds();
      runInAction(() => {
        favorites.forEach((favorite) => {
          this.favoriteRegistry.set(favorite, favorite);
        });
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  };
}
