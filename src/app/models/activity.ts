export interface IActivityFormValues {
    type: ActivityTypes,
    title: string,
    description?: string,
    images?: Blob[],
    answer?: string,
    location?: string,
    latitude?: number | null,
    longitude?: number | null,
    startDate?: string | null,
    endDate?: string | null,
    dateCreated?: string | null,
    dateStart: Date | null,
    dateEnd: Date | null,
    timeStart: Date | null,
    timeEnd: Date | null,
    [key: string]: any,
  };

  export interface IActivitiesEnvelope {
    activities: IActivity[],
    activityCount: number,
  };
  
  export interface IActivity extends IActivityFormValues {
    id: string,
    userName: string,
    photos?: IPhoto[],
    isHost: boolean,
    dateApproved?: string | null,
    numberofAttendees: number,
    isUserAttending: boolean,
    isHeld : boolean,
    isChallengeAnswered: boolean,
  }; 

  export interface IPendingActivitiesEnvelope {
    activities: IPendingActivity[],
    activityCount: number;
  };

  export interface IPendingActivity extends IActivityFormValues {
    id: string,
    userName: string,
    photos?: IPhoto[],
    urls: string[],
  }; 

  export interface IHappeningEnvelope {
    happenings: IHappening[],
    happeningCount: number,
  };

  export interface IChallengeAnswerEnvelope {
    challengeAnswers: IChallengeAnswer[],
    challengeAnswerCount: number,
  };

  export interface IChallengeEnvelope {
    challenges: IChallenge[],
    challengeCount: number,
  };

  export interface IHappening extends IActivity {
    happeningPhotos: IPhoto[],
  };

  export interface IChallenge extends IActivity {
    challengeAnswerId: string,
    challengeUserName: string,
    challengeDesription: string
    challengePhotos: IPhoto[],
  };

  export interface IChallengeAnswer {
    id: string,
    description?: string,
    confirmed: boolean,
    challengePhotos?: IPhoto[],
  };

  export interface IChallengeAnswerForm {
    description?: string,
    images?: Blob[],
    [key: string]: any,
  };

  export interface IPhoto {
    id: string,
    url: string,
  };

  export enum ActivityTypes{
    GoodDeed = 1,
    Joke = 2,
    Quote = 3,
    Puzzle = 4,
    Happening = 5,
    Challenge = 6,
    "Dobro Delo" = GoodDeed,
    "Vic" = Joke,
    "Izreka" = Quote,
    "Zagonetka" = Puzzle,
    "Događaj" = Happening,
    "Izazov" = Challenge
  }