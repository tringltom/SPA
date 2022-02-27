import { ActivityTypes, IPhoto } from "./activity";

export interface IUser {
  id?: number;
  userName: string;
  token: string;
  image?: IPhoto;
  currentLevel: string;
  currentXp: string;
  numberOfGoodDeeds: string;
  numberOfJokes: string;
  numberOfQuotes: string;
  numberOfPuzzles: string;
  numberOfHappenings: string;
  numberOfChallenges: string;
  isDiceRollAllowed: boolean;
  activityCounts: Array<IUserActivityCount>;
  about:string;
};

export interface IUserFormValues {
  email: string;
  password: string;
  userName?: string;
  stayLoggedIn? : boolean;
};

export interface IUserEnvelope {
  users: IUser[] | null;
  userCount: number;
};

export interface IUserImageEnvelope {
  users: IUser[] | null;
  userCount: number;
}

export interface IUserActivityCount {
  type: ActivityTypes;
  max: number;
  available: number;
}
