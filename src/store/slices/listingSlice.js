import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchListingsApi } from '../../services/listingService';
import { submitNewListing } from './createListingSlice';

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
    reducers: {
        removeListing: (state, action) => {
            state.items = state.items.filter(listing => listing._id !== action.payload);
        },
        updateListingLocally: (state, action) => {
            const index = state.items.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.meta.arg) {
                    state.items = action.payload.listings;
                } else {
                    // Append new items while preventing duplicates
                    const existingIds = new Set(state.items.map(i => i._id));
                    const newItems = action.payload.listings.filter(i => !existingIds.has(i._id));
                    state.items = [...state.items, ...newItems];
                }
                state.hasNextPage = action.payload.hasNextPage;
            })
            .addCase(fetchListings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(submitNewListing.fulfilled, (state, action) => {
                const newListing = action.payload?.listing || action.payload;
                if (newListing && newListing._id) {
                    state.items.unshift(newListing);
                }
            });
    }
});

export const { removeListing, updateListingLocally } = listingSlice.actions;

export default listingSlice.reducer;