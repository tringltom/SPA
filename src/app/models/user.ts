export interface IUser {
  username: string;
  token: string;
  image?: string;
  level: string;
  xp: string;
};

export interface IUserFormValues {
  email: string;
  password: string;
  userName?: string;
  stayLoggedIn? : boolean;
};
