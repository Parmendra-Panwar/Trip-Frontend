import api from './authService';

export const fetchListingsApi = (lastId = '', limit = 12) => api.get(`/listings?lastId=${lastId}&limit=${limit}`);

export const fetchListingById = (id) => api.get(`/listings/${id}`);

export const createListingApi = (formData) => {
    return api.post('/listings', formData, {
        headers: {
            'Content-Type': undefined,
        },
    });
};

export const updateListingApi = (id, formData) => {
    return api.put(`/listings/${id}`, formData, {
        headers: {
            'Content-Type': undefined,
        },
    });
};

export const deleteListingApi = (id) => api.delete(`/listings/${id}`)