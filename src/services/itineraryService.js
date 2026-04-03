import api from "./authService";

export const planTripApi = async (tripData) => {
    return await api.post('/itinerary/plan-itinerary', tripData);
};

export const saveTripApi = async (finalData) => {
    return await api.post(`/itinerary/book`, finalData);
};

export const getItinerariesApi = async () => {
    return await api.get('/itinerary/user');
};

export const getSingleItineraryApi = async (id) => {
    return await api.get(`/itinerary/single/${id}`);
};
