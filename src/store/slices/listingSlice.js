import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchListingsApi } from '../../services/listingService';

export const fetchListings = createAsyncThunk('listings/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await fetchListingsApi();
        return response.data;
    } catch (err) {
        return rejectWithValue("Backend is offline");
    }
});

const listingSlice = createSlice({
    name: 'listings',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchListings.rejected, (state, action) => {
                // state.loading = false;
                state.error = action.payload;
                console.log("Backend still waking up...");
            });
    }
});

export default listingSlice.reducer;