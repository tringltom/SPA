import axios, {AxiosResponse} from 'axios';
import { IUser, IUserFormValues } from '../models/user';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:4000';

axios.interceptors.response.use(undefined, (error) => {
    if(error.message === 'Network Error' && !error.response) 
        toast.error('Mrežna Greška - Servis trenutno nije dostupan');

    throw error.response;
});

const responseBody = (response : AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {} ) => axios.put(url,body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const User = {
    current: (): Promise<IUser> => requests.get('/users'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/users/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/users/register', user),
    fbLogin: (accessToken: string) => requests.post(`/users/facebook`, {accessToken}),
    refreshToken: () : Promise<IUser> => requests.post(`/users/refreshToken`, {}),
    verifyEmail: (token: string, email: string) : Promise<void> => requests.post(`/users/verifyEmail`, {token, email}),
    resendVerifyEmailConfirm: (email: string) : Promise<void> => requests.get(`/users/resendEmailVerification?email=${email}`)
}

const sites = {
    User
}

export default sites;