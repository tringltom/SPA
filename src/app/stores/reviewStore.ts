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
  
  get reviewsForCurrentUserArray() {
    return Array.from(this.reviewsForCurrentUserRegistry.values());
  }

  loadReviewedActivities = async (userId: number) => {
    try {
      const reviews =  await agent.Review.getReviewsForUser(userId);
      runInAction(() => {
          reviews.forEach((review) => {
          this.reviewsForCurrentUserRegistry.set(review.activityId, review);
        });
      });
    } catch (error) {
        console.log(error);
    }
  };

  reviewActivity = async (userId: number, activityId: number, reviewType: ReviewTypes) => {
      try {
        await agent.Review.reviewActivity(userId, activityId, reviewType).then(() =>
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
