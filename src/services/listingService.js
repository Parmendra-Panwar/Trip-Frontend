import api from './authService';

export const fetchListingsApi = (lastId = '', limit = 12) => api.get(`/listings?lastId=${lastId}&limit=${limit}`);

export const fetchListingById = (id) => api.get(`/listings/${id}`);

// createListingApi (Frontend)
export const createListingApi = (formData) => {
    return api.post('/listings', formData, {
        headers: {
            'Content-Type': undefined, // 🔥 Isse auto boundary generate hogi
        },
    });
};