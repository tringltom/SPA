import { ActivityTypes } from "./activity";

export interface IUser {
  username: string;
  token: string;
  image?: string;
  currentLevel: string;
  currentXp: string;
  isDiceRollAllowed: boolean;
  activityCounts: Array<IUserActivityCount>;
};

export interface IUserFormValues {
  email: string;
  password: string;
  userName?: string;
  stayLoggedIn? : boolean;
};

export interface IUserActivityCount {
  type: ActivityTypes;
  max: number;
  available: number;
}
