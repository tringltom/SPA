import { ActivityTypes } from "./activity";

export interface IUser {
  id?: number;
  username: string;
  token: string;
  image?: string;
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
export interface IUserActivityCount {
  type: ActivityTypes;
  max: number;
  available: number;
}
