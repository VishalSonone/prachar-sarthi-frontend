import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://prachar-sarthi-backend-fvddavfzfwfcfrfp.canadacentral-01.azurewebsites.net/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const karyakartaService = {
    getAll: () => api.get('/karyakarta'),
    getById: (id) => api.get(`/karyakarta/${id}`),
    create: (data) => api.post('/karyakarta', data),
    update: (id, data) => api.put(`/karyakarta/${id}`, data),
    delete: (id) => api.delete(`/karyakarta/${id}`),
};

export const birthdayService = {
    getTodays: () => api.get('/birthday/today'),
};

export default api;
