import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ReviewTypes } from "../models/review";
import { RootStore } from "./rootStore";

export default class ReviewStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  reviewsForCurrentUserRegistry = new Map();
  loading = false;
  
  get reviewsForCurrentUserArray() {
    return Array.from(this.reviewsForCurrentUserRegistry.values());
  }

  loadReviewedActivities = async (userId: number) => {
    this.loading = true;
    try {
      const reviews =  await agent.Review.getReviewsForUser(userId);
      runInAction(() => {
          reviews.forEach((review) => {
          this.reviewsForCurrentUserRegistry.set(review.activityId, review);
        });
        this.loading = false;
      });
    } catch (error) {
        console.log(error);
        this.loading = false;
    }
  };

  reviewActivity = async (activityId: number, reviewType: ReviewTypes) => {
      try {
        await agent.Review.reviewActivity(activityId, reviewType).then(() =>
          {
            runInAction(() => {
              this.reviewsForCurrentUserRegistry.set(activityId, {activityId: activityId, reviewTypeId: reviewType});
            });
          }
        );
      }
      catch(error){
          console.log(error);
      }
  }

}
