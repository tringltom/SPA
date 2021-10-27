export interface IActivityFormValues {
    type: number;
    title: string;
    description?: string;
    image?: Blob;
    answer?: string;
    [key: string]: any;
  };

  export interface IActivitiesEnvelope {
    activities: IActivity[];
    activityCount: number;
  };
  
  export interface IActivity extends IActivityFormValues{
    
}  