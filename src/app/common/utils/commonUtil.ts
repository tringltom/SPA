import { IActivity } from "../../models/activity";
import { IUser } from "../../models/user";

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.isHost = activity.userName === user.userName
    
    return activity;
}