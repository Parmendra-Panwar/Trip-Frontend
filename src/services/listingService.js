import api from './authService'; // Use the axios instance we created

export const fetchListingsApi = () => api.get('/listings');