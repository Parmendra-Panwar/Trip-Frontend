import api from './authService';

export const fetchActivitiesApi = (lastId = '', limit = 12) => api.get(`/activities?lastId=${lastId}&limit=${limit}`);

export const fetchActivityById = (id) => api.get(`/activities/${id}`);

export const createActivityApi = (formData) => {
    return api.post('/activities', formData, {
        headers: {
            'Content-Type': undefined, 
        },
    });
};

export const updateActivityApi = (id, formData) => {
    return api.put(`/activities/${id}`, formData, {
        headers: {
            'Content-Type': undefined,
        },
    });
};

export const deleteActivityApi = (id) => api.delete(`/activities/${id}`);
