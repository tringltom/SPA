export interface IUser {
  username: string;
  token: string;
  image?: string;
};

export interface IUserFormValues {
  email: string;
  password: string;
  userName?: string;
};
