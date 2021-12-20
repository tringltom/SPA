export interface IActivityFormValues {
    type: ActivityTypes;
    title: string;
    description?: string;
    images?: Blob[];
    answer?: string;
    location?: string;
    latitude?: number | null;
    longitude?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    [key: string]: any;
  };

  export interface IActivitiesEnvelope {
    activities: IActivity[];
    activityCount: number;
  };
  
  export interface IActivity extends IActivityFormValues {
    id: string;
    userName: string;
    photos?: IPhoto[];
    isHost: boolean;
  }; 

  export interface IPhoto {
    id: string;
    url: string;
  };

  export enum ActivityTypes{
    GoodDeed = 1,
    Joke = 2,
    Quote = 3,
    Puzzle = 4,
    Happening = 5,
    Challenge = 6,
  }