import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchListingsApi } from '../../services/listingService';

export const fetchListings = createAsyncThunk('listings/fetchAll', async (lastId = '', { rejectWithValue }) => {
    try {
        const response = await fetchListingsApi(lastId);
        return response.data;
    } catch (err) {
        return rejectWithValue("Backend is offline");
    }
});

const listingSlice = createSlice({
    name: 'listings',
    initialState: {
        items: [],
        hasNextPage: false,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.loading = false;
                // RAM Optimization: Sirf pehli baar data Redux mein save karo
                if (!action.meta.arg) {
                    state.items = action.payload.listings;
                }
                state.hasNextPage = action.payload.hasNextPage;
            })
            .addCase(fetchListings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default listingSlice.reducer;