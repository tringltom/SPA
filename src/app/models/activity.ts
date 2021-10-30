export interface IActivityFormValues {
    type: number;
    title: string;
    description?: string;
    image?: Blob;
    answer?: string;
    location?: string;
    latitude?: number | null;
    longitude?: number | null;
    startDate?: Date;
    endDate?: Date;
    [key: string]: any;
  };