import { makeAutoObservable, runInAction } from "mobx";

import { ActivityTypes } from "../models/activity";
import { ReviewTypes } from "../models/review";
import { RootStore } from "./rootStore";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ReviewStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  reviewsForCurrentUserRegistry = new Map();
  loading = false;
  reviewing = false;

  get reviewsForCurrentUserArray() {
    return Array.from(this.reviewsForCurrentUserRegistry.values());
  }

  loadReviewedActivities = async () => {
    this.loading = true;
    try {
      const reviews = await agent.Review.getOwnerReviews();
      runInAction(() => {
        reviews.forEach((review) => {
          this.reviewsForCurrentUserRegistry.set(review.activityId, review);
        });
        this.loading = false;
      });
    } catch (error) {
      console.log(error)
      this.loading = false;
    }
  };

  reviewActivity = async (activityId: number, activityTypeId: ActivityTypes, reviewType: ReviewTypes) => {
    try {
      this.reviewing = true;
      await agent.Review.reviewActivity(activityId, activityTypeId, reviewType).then(() => {
        runInAction(() => {
          this.reviewsForCurrentUserRegistry.set(activityId, {
            activityId: activityId,
            reviewTypeId: reviewType,
          });
          this.reviewing = false;
        });
      });
    } catch (error) {
      this.reviewing = false;
      toast.error("Došlo je do problema sa ocenom aktivnosti");
    }
  };
}
