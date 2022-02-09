import axios, { AxiosResponse } from "axios";
import { IUser, IUserFormValues } from "../models/user";
import { toast } from "react-toastify";
import { IActivitiesEnvelope, IActivityFormValues } from "../models/activity";
import { history } from '../..';
import { IDiceResult } from "../models/diceResult";
import { IReview, ReviewTypes } from "../models/review";

axios.defaults.baseURL = process.env.NODE_ENV !== 'production'
? "https://localhost:4001"
: "https://ekviti.rs/api";

axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  const token = window.localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
     return config
 }, error => {
     return Promise.reject(error);
 })

 axios.interceptors.response.use(undefined, (error) => {
   if (error.message === "Network Error" && !error.response) {
     toast.error("Servis trenutno nije dostupan, molimo Vas pokušajte kasnije");
   }
   const { status, data, config, headers } = error.response;
   if (status === 404) {
     history.push("/notfound");
   }
   if (
     status === 401 &&
     headers["www-authenticate"] ===
       'Bearer error="invalid_token",error_description="The token is expired""'
   ) {
     window.localStorage.removeItem("jwt");
     history.push("/");
     toast.info("Sesija Vam je istekla, Molimo Vas ulogujte se opet");
   }
   if (
     status === 400 &&
     config.method === "get" &&
     data.errors.hasOwnProperty("id")
   ) {
     history.push("/notfound");
   }
   if (status === 500) {
     toast.error("Mrežna greška - Problem na servisu, molimo Vas pokušajte kasnije");
   }
   throw error.response;
 });

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, formData : any) => {
    return axios.post(url, formData, {
        headers: {'Content-type': 'multipart/form-data'},
    }).then(responseBody)
}
};

const User = {
  current: (): Promise<IUser> => requests.get("/users"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/users/login", user),
  logout: (): Promise<void> =>
    requests.post("/users/logout", {}),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/users/register", user),
  fbLogin: (accessToken: string) =>
    requests.post("/users/facebook", { accessToken }),
  refreshToken: (): Promise<IUser> => requests.post("/users/refreshToken", {}),
  verifyEmail: (token: string, email: string): Promise<void> =>
    requests.post("/users/verifyEmail", { token, email }),
  resendVerifyEmailConfirm: (email: string): Promise<void> =>
    requests.get(`/users/resendEmailVerification?email=${email}`),
  recoverPassword: (email: string): Promise<string> =>
    requests.post("/users/RecoverPassword", email),
};

const Activity = {
  create: (activity: IActivityFormValues): Promise<string> => {
    let formData = new FormData();
    Object.keys(activity).forEach((key) => {
      if (key === "images") {
        activity[key]?.map((image) => formData.append(key, image));
      } else {
        formData.append(key, activity[key]);
      }
    });
    return requests.postForm("/activities/create", formData);
  },
  getPendingActivities: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get("/activities",{params: params}).then(responseBody),
  resolvePendingActivity : (id: string, approve: boolean): Promise<boolean> => requests.post(`/activities/resolve/${id}`, {approve}),
  getApprovedActivitiesFromOtherUsers: (userId: number, params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get(`/activities/approvedActivitiesExcludeUser/${userId}`,{params: params}).then(responseBody)
};

const Dice = {
  roll: () : Promise<IDiceResult> => requests.get("/dice/rollTheDice")
}

const Review = {
  getReviewsForUser: (userId: number) : Promise<IReview[]> => requests.get(`reviews/getReviewsForUser?userId=${userId}`),
  reviewActivity: (activityId: number, reviewTypeId: ReviewTypes) : Promise<void> => requests.post("reviews/reviewActivity", {activityId, reviewTypeId})
}

const Favorite = {
  getFavoritesForUser: (userId: number) : Promise<number[]> => requests.get(`favorites/${userId}`),
  resolveFavoriteActivity: (activityId: number ) : Promise<void> => requests.post("favorites/resolveFavorite", {activityId})
}

const sites = {
  User,
  Activity,
  Dice,
  Review,
  Favorite,
};

export default sites;
