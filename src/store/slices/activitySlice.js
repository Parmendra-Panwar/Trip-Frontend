import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivitiesApi } from '../../services/activityService';
import { submitNewActivity } from './createActivitySlice';

export const fetchActivities = createAsyncThunk('activities/fetchAll', async (lastId = '', { rejectWithValue }) => {
    try {
        const response = await fetchActivitiesApi(lastId);
        return response.data;
    } catch (err) {
        return rejectWithValue("Backend is offline or failed");
    }
});

const activitySlice = createSlice({
    name: 'activities',
    initialState: {
        items: [],
        hasNextPage: false,
        loading: false,
        error: null,
    },
    reducers: {
        removeActivity: (state, action) => {
            state.items = state.items.filter(activity => activity._id !== action.payload);
        },
        updateActivityLocally: (state, action) => {
            const index = state.items.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivities.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.meta.arg) {
                    state.items = action.payload.activities || action.payload.data || [];
                } else {
                    const payloadActivities = action.payload.activities || action.payload.data || [];
                    const existingIds = new Set(state.items.map(i => i._id));
                    const newItems = payloadActivities.filter(i => !existingIds.has(i._id));
                    state.items = [...state.items, ...newItems];
                }
                state.hasNextPage = action.payload.hasNextPage || false;
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitNewActivity.fulfilled, (state, action) => {
                const newActivity = action.payload?.activity || action.payload;
                if (newActivity && newActivity._id) {
                    state.items.unshift(newActivity);
                }
            });
    }
});

export const { removeActivity, updateActivityLocally } = activitySlice.actions;

export default activitySlice.reducer;
