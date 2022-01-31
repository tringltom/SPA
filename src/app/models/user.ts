export interface IUser {
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
