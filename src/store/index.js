import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingReducer from './slices/listingSlice';
import createListingReducer from './slices/createListingSlice';
import profileReducer from './slices/profileSlice';
import activityReducer from './slices/activitySlice';
import createActivityReducer from './slices/createActivitySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listings: listingReducer,
        createListing: createListingReducer,
        profile: profileReducer,
        activities: activityReducer,
        createActivity: createActivityReducer,
    },
});

export default store;