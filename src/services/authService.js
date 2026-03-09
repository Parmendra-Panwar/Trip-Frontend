import axios from 'axios';

// 1. Axios Instance Setup
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Aapne backend mein jo prefix rakha ho
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Request Interceptor (Auto-send Token)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. Response Interceptor (Handle 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Agar token expire ho jaye ya invalid ho, toh auto-logout kar do
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 4. API Endpoint Functions
export const loginApi = (credentials) => api.post('/auth/login', credentials);

export const signupApi = (userData) => api.post('/auth/signup', userData);

export const profileApi = () => api.get('/auth/profile');

// Default export agar instance kahin aur use karna ho
export default api;