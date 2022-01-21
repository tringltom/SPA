export interface IReview {
    activityId: number,
    reviewTypeId: ReviewTypes
  };

  export enum ReviewTypes{
    None = 1,
    Poor = 2,
    Good = 3,
    Awesome = 4
  }