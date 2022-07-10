import { ActivityTypes } from "./activity";

export interface IReview {
    activityId: number,
    activityTypeId: ActivityTypes
    reviewTypeId: ReviewTypes
    userId: number
  };

  export enum ReviewTypes{
    None = 1,
    Poor = 2,
    Good = 3,
    Awesome = 4
  }