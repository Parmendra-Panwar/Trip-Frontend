import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';
import createListingReducer from './slices/createListingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listings: listingReducer,
        createListing: createListingReducer,
    },
});

export default store;