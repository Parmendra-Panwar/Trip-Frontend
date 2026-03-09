import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listings: listingReducer,
    },
});

// Default export bhi add kar do safety ke liye
export default store;