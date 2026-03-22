import api from './authServicee';

export const fetchProfileApi = (username, page = 1) =>
    api.get(`/profile/${username}?page=${page}&limit=12`);

export const updateProfileApi = (username, data) =>
    api.put(`/profile/${username}`, data);