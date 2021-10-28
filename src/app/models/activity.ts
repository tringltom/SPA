export interface IActivityFormValues {
    type: number;
    title: string;
    description?: string;
    image?: Blob;
    answer?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    [key: string]: any;
  };