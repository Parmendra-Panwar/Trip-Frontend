import api from './authService';

export const fetchListingsApi = (page = 1) => api.get(`/listings?page=${page}&limit=12`);

export const fetchListingById = (id) => api.get(`/listings/${id}`);

// createListingApi (Frontend)
export const createListingApi = (formData) => {
    return api.post('/listings', formData, {
        headers: {
            'Content-Type': undefined, // 🔥 Isse auto boundary generate hogi
        },
    });
};