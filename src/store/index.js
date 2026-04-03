import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';
import createListingReducer from './slices/createListingSlice';
import profileReducer from './slices/profileSlice';
import activityReducer from './slices/activitySlice';
import createActivityReducer from './slices/createActivitySlice';
import tripReducer from './slices/tripSlice';
import createTripReducer from './slices/createTripSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listings: listingReducer,
        createListing: createListingReducer,
        profile: profileReducer,
        activities: activityReducer,
        createActivity: createActivityReducer,
        trips: tripReducer,
        createTrip: createTripReducer,
        toast: toastReducer,
    },
});

export default store;