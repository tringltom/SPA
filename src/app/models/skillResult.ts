import { ActivityTypes } from "./activity";

export interface ISkillData {
    currentLevel: number,
    xpLevel: number,
    skillLevels : ISkillLevel[],
  };

  export interface ISkillLevel {
    level: number,
    type: ActivityTypes,
  };  