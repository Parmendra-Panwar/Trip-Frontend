import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTripsApi } from '../../services/tripService';
import { submitNewTrip } from './createTripSlice';

export const fetchTrips = createAsyncThunk('trips/fetchAll', async (lastId = '', { rejectWithValue }) => {
    try {
        const response = await fetchTripsApi(lastId);
        return response.data;
    } catch (err) {
        return rejectWithValue("Backend is offline or failed");
    }
});

const tripSlice = createSlice({
    name: 'trips',
    initialState: {
        items: [],
        hasNextPage: false,
        loading: false,
        error: null,
    },
    reducers: {
        removeTrip: (state, action) => {
            state.items = state.items.filter(trip => trip._id !== action.payload);
        },
        updateTripLocally: (state, action) => {
            const index = state.items.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrips.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchTrips.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.meta.arg) {
                    state.items = action.payload.trips || action.payload.data || [];
                    state.hasNextPage = action.payload.hasNextPage || false;
                }
                // We ignore paginated fetches in Redux to save RAM
            })
            .addCase(fetchTrips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitNewTrip.fulfilled, (state, action) => {
                const newTrip = action.payload?.trip || action.payload;
                if (newTrip && newTrip._id) {
                    state.items.unshift(newTrip);
                }
            });
    }
});

export const { removeTrip, updateTripLocally } = tripSlice.actions;

export default tripSlice.reducer;
