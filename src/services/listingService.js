import api from './authService';

export const fetchListingsApi = (page = 1) => api.get(`/listings?page=${page}&limit=12`);

export const fetchListingById = (id) => api.get(`/listings/${id}`);