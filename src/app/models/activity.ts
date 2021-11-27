export interface IActivityFormValues {
    type: number;
    title: string;
    description?: string;
    images?: Blob[];
    answer?: string;
    location?: string;
    latitude?: number | null;
    longitude?: number | null;
    startDate?: string | null;
    endDate?: string | null;
    [key: string]: any;
  };