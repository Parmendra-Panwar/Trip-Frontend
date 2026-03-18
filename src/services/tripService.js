import api from './authService';

export const fetchTripsApi = (lastId = '', limit = 12) => api.get(`/trips?lastId=${lastId}&limit=${limit}`);

export const fetchTripById = (id) => api.get(`/trips/${id}`);

export const createTripApi = (formData) => {
    return api.post('/trips', formData, {
        headers: {
            'Content-Type': undefined, 
        },
    });
};

export const updateTripApi = (id, formData) => {
    return api.put(`/trips/${id}`, formData, {
        headers: {
            'Content-Type': undefined,
        },
    });
};

export const deleteTripApi = (id) => api.delete(`/trips/${id}`);
