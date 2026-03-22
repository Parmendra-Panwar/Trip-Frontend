import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlicee';
import listingReducer from './slices/listingSlice';
import createListingReducer from './slices/createListingSlice';
import profileReducer from './slices/profileSlicee';
import activityReducer from './slices/activitySlice';
import createActivityReducer from './slices/createActivitySlice';
import tripReducer from './slices/tripSlicee';
import createTripReducer from './slices/createTripSlice';

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
    },
});

export default store;