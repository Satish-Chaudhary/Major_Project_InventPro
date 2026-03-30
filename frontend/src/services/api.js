import axios from 'axios';
import { serverUrl } from '../config/api';

const api = axios.create({
    baseURL: serverUrl + '/api',
    withCredentials: true
});

// Interceptors if needed
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
