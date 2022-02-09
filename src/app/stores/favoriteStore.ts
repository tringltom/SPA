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
  loading = false;
  
  get favoritesArray() {
    return Array.from(this.favoriteRegistry.values());
  }

  resolveFavoriteActivity = async (activityId: number, favorite : boolean) => {
    this.loading = true;
    try {
        await agent.Favorite.resolveFavoriteActivity(activityId).then(() => 
            runInAction(() => {
              favorite ?
                this.favoriteRegistry.set(activityId, activityId)
                : this.favoriteRegistry.delete(activityId);

                this.loading = false;
            })
        );
      } catch (error) {
          console.log(error);
          this.loading = false;
      }
  };

  loadFavoriteActivitiesForUser = async (userId: number) => {
    this.loading = true;
    try {
      const favorites = await agent.Favorite.getFavoritesForUser(userId);
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
