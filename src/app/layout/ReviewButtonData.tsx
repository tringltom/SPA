import { ActivityTypes } from "../models/activity";
import { ReviewTypes } from "../models/review";

export interface IButtonData {
    name: string,
    icon: string,
    value: ReviewTypes
}

export const getButtonData = (activityType: ActivityTypes | null): IButtonData[]  => {

    const iconNames = getIconNames(activityType);

    return (
    [
        {
            name: "None",
            icon: iconNames[0],
            value: ReviewTypes.None
        },
        {
            name: "Poor",
            icon: iconNames[1],
            value: ReviewTypes.Poor
        },
        {
            name: "Good",
            icon: iconNames[2],
            value: ReviewTypes.Good
        },
        {
            name: "Awesome",
            icon: iconNames[3],
            value: ReviewTypes.Awesome
        }
    ]);
}

const getIconNames = (activityType: ActivityTypes | null) => {
    switch(activityType)
    {
    case ActivityTypes.GoodDeed:
        return ["thumbs down", "thumbs up", "like", "exclamation"];

    case ActivityTypes.Joke:
        return ["frown", "smile", "like", "fire"];

    case ActivityTypes.Quote:
        return ["ban", "question circle", "like", "fire"];

    case ActivityTypes.Puzzle:
        return ["ban", "question circle", "question", "fire"];

    case ActivityTypes.Happening:
        return ["angle left", "angle right", "angle up", "angle down"];

    case ActivityTypes.Challenge:
        return ["caret left", "caret right", "caret up", "caret down"];

    default: 
        return ["question", "question", "question", "question"];
    }
}