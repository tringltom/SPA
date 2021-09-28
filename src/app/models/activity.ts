export interface IActivityFormValues {
    type: number;
    title: string;
    description?: string;
    image?: Blob;
    answer?: string;
    [key: string]: any;
  };