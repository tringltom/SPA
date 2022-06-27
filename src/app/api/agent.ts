import { ActivityTypes, IActivitiesEnvelope, IActivity, IActivityFormValues, IApprovedActivitiesEnvelope, IChallengeAnswerEnvelope, IChallengeAnswerForm, IChallengeEnvelope, IHappeningEnvelope, IPendingActivitiesEnvelope, IPendingActivity } from "../models/activity";
import { IReview, ReviewTypes } from "../models/review";
import { IUser, IUserEnvelope, IUserFormValues, IUserImageEnvelope } from "../models/user";
import axios, { AxiosResponse } from "axios";

import { IDiceResult } from "../models/diceResult";
import { ISkillData } from "../models/skillResult";
import { IUserFavoriteActivity } from "../models/Favorites";
import { history } from '../..';
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

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
   const { status, data, config, headers } = error?.response;
   if (status === 404 && !data.errors) {
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
   if ((status === 400 || status === 404) && config.method === "get" && config.url !== '/session/me') {
     toast.error(data.errors.error);
   }
   if (status === 500) {
     toast.error(
       "Mrežna greška - Problem na servisu, molimo Vas pokušajte kasnije"
     );
   }
   throw error.response;
 });

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  head: (url: string) => axios.head(url).then(responseBody),
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  patch: (url: string, body: {}) => axios.patch(url, body, {headers: {'Content-type': 'application/json'}}).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, formData : any) => {
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
  patchForm: (url: string, formData : any) => {
    return axios
      .patch(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
  putForm: (url: string, formData : any) => {
    return axios
      .put(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  }
};

const Session = {
  sendEmailVerification: (email: string): Promise<string> => requests.head(`/session/email?email=${email}`),
  sendRecoverPassword: (email: string): Promise<string> => requests.head(`/session/password?email=${email}`),
  login: (user: IUserFormValues): Promise<IUser> => requests.put("/session", user),
  current: (): Promise<IUser> => requests.get("/session/me"),
  refreshToken: (): Promise<IUser> => requests.put("/session/refresh", {}),
  verifyEmail: (token: string, email: string): Promise<string> => requests.patch("/session/email", { token, email }),
  verifyPasswordRecovery: (token: string, email: string, newPassword: string): Promise<string> => 
    requests.patch("/session/password", {email, token, newPassword}),
  logout: (): Promise<void> => requests.delete("/session"),
  register: (user: IUserFormValues): Promise<IUser> => requests.post("/session", user),
  fbLogin: (accessToken: string) => requests.post("/session/facebook", { accessToken }),
};

const User = {
  getRankedUsers: (params: URLSearchParams): Promise<IUserEnvelope> =>
    axios.get('/users', {params: params}).then(responseBody),
  getImagesForApproval: (params: URLSearchParams): Promise<IUserImageEnvelope> => 
    axios.get('/users/pending-images', {params: params}).then(responseBody),
  updateAbout: (about: string): Promise<string> => requests.patch("/users/me/about", {about}),
  updateImage: (image: Blob): Promise<string> => {
    let formData = new FormData();
    formData.append('image', image);
    return requests.patchForm("/users/me/image", formData);
  },
  resolveImage: (id: string, approve: boolean): Promise<void> => requests.patch(`/users/${id}`, {approve})
};

const Activity = {
  getActivity : (id: string) : Promise<IActivity> => requests.get(`/activities/${id}`),
  getActivitiesFromOtherUsers: (params: URLSearchParams) : Promise<IActivitiesEnvelope> =>
    axios.get("/activities/others",{params: params}).then(responseBody),
  getApprovedActivities:(id: number, params: URLSearchParams) : Promise<IApprovedActivitiesEnvelope> => 
    axios.get(`/activities/approved-activities/user/${id}`,{params: params}).then(responseBody),
  getHappeningsForApproval: (params: URLSearchParams) : Promise<IHappeningEnvelope> =>
    axios.get("/activities/pending-happenings",{params: params}).then(responseBody),
  getChallengeAnswers: (activityId: string, params: URLSearchParams) : Promise<IChallengeAnswerEnvelope> =>
    axios.get(`/activities/me/challenge-answers/activity/${activityId}`,{params: params}).then(responseBody),
  getChallengeConfirmedAnswers: (params: URLSearchParams) : Promise<IChallengeEnvelope> =>
    axios.get("/activities/pending-challenges",{params: params}).then(responseBody),
  answerPuzzle: (id: string, answer : string) : Promise<number> => 
    requests.patch(`/activities/${id}/puzzle-answer`, {answer}),
  answerChallenge: (id: string, answer : IChallengeAnswerForm): Promise<void> => {
    let formData = new FormData();
    Object.keys(answer).forEach((key) => {
      if (key === "images") {
        answer[key]?.map((image) => formData.append(key, image));
      } else {
        formData.append(key, answer[key]);
      }
    });
    return requests.postForm(`/activities/${id}/challenge-answer`, formData);
  },
  confirmChallengeAnswer: (id: string) : Promise<void> => 
    requests.patch(`/activities/challenge-confirmation/${id}`, {}),
  approveChallengeAnswer: (id: string) : Promise<void> => 
    requests.post(`/activities/challenge-answer-approval/${id}`, {}),
  disapproveChallengeAnswer: (id: string) : Promise<void> => 
    requests.patch(`/activities/challenge-answer-disapproval/${id}`, {}),
  approvePendingActivity : (id: string) : Promise<IActivity> =>
    requests.post(`/activities/pending-activity/${id}`, {}),
  approveHappening : (id: string, approve: boolean) : Promise<void> =>
    requests.patch(`/activities/${id}/happening-completion-approval`, {approve}),
  attendToHappening: (id: string) : Promise<void> =>
    requests.post(`/activities/${id}/attendence`, {}),
  cancelAttendenceToHappening: (id: string) : Promise<void> =>
    requests.delete(`/activities/${id}/attendence`),
  confirmAttendenceToHappening: (id: string) : Promise<void> =>
    requests.patch(`/activities/${id}/attendence-confirmation`, {}),
  completeHappening: (id: string, images: Blob[]): Promise<string> => {
    let formData = new FormData();
    images.map((image) => formData.append('images', image));
    return requests.postForm(`/activities/${id}/happening-completion`, formData);
  },
};

const PendingActivity = {
  getPendingActivities: (params: URLSearchParams): Promise<IPendingActivitiesEnvelope> => 
    axios.get("/pending-activities",{params: params}).then(responseBody),
  getOwnerPendingActivities: (params: URLSearchParams): Promise<IPendingActivitiesEnvelope> => 
    axios.get("/pending-activities/me",{params: params}).then(responseBody),
  getOwnerPendingActivity: (id: string): Promise<IActivityFormValues> =>
    requests.get(`/pending-activities/me/${id}`),
  update: (id: string, activity: IActivityFormValues): Promise<IPendingActivity> => {
    let formData = new FormData();
    Object.keys(activity).forEach((key) => {
      if (key === "images") {
        activity[key]?.map((image) => formData.append(key, image));
      } else {
        formData.append(key, activity[key]);
      }
    });
    return requests.putForm(`/pending-activities/${id}`, formData);
  },
  dissaprove: (id: string): Promise<void> => requests.delete(`/pending-activities/${id}`),
  create: (activity: IActivityFormValues): Promise<IPendingActivity> => {
    let formData = new FormData();
    Object.keys(activity).forEach((key) => {
      if (key === "images") {
        activity[key]?.map((image) => formData.append(key, image));
      } else {
        formData.append(key, activity[key]);
      }
    });
    return requests.postForm("/pending-activities", formData);
  }
};

const Dice = {
  roll: () : Promise<IDiceResult> => requests.post("/dice/roll", {})
}

const Review = {
  getOwnerReviews: () : Promise<IReview[]> => requests.get("reviews/me"),
  reviewActivity: (activityId: number, activityTypeId:ActivityTypes, reviewTypeId: ReviewTypes) : Promise<void> =>
    requests.put("reviews/", {activityId, activityTypeId, reviewTypeId})
}

const Favorite = {
  get: () : Promise<IUserFavoriteActivity> => requests.get(`favorites/me/ids`),
  getOwnerFavoriteActivityIds: () : Promise<number[]> => requests.get(`favorites/me/ids`),
  removeFavoriteActivity: (id: number): Promise<void> => requests.delete(`/favorites/${id}`),
  createFavoriteActivity: (id: number) : Promise<IUserFavoriteActivity> => requests.post(`favorites/${id}`, {})
}

const Profile = {
  getSkills: (userId: number) : Promise<ISkillData> => requests.get(`skills/user/${userId}`),
  updateSkills: (skillData : ISkillData): Promise<IUser> => requests.put("/skills/user/me", skillData),
}

const sites = {
  Session,
  User,
  Activity,
  PendingActivity,
  Dice,
  Review,
  Favorite,
  Profile,
};

export default sites;
