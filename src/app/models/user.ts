export interface IUser {
  username: string;
  token: string;
  image?: string;
  currentLevel: string;
  currentXp: string;
  isDiceRollAllowed: boolean;
};

export interface IUserFormValues {
  email: string;
  password: string;
  userName?: string;
  stayLoggedIn? : boolean;
};
