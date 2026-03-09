import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchListingsApi } from '../../services/listingService';

export const fetchListings = createAsyncThunk('listings/fetchAll', async (page = 1, { rejectWithValue }) => {
    try {
        const response = await fetchListingsApi(page);
        return response.data;
    } catch (err) {
        return rejectWithValue("Backend is offline");
    }
});

const listingSlice = createSlice({
    name: 'listings',
    initialState: {
        items: [],
        pagination: {
            currentPage: 1,
            totalPages: 1
        },
        loading: false,
        error: null,
    },
    reducers: {
        resetPagination: (state) => {
            state.pagination.currentPage = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.loading = false;

                // save only first load data to reduce the redux ram  
                if (action.payload.currentPage === 1) {
                    state.items = action.payload.listings;
                }

                // Pagination state update
                state.pagination.currentPage = action.payload.currentPage;
                state.pagination.totalPages = action.payload.totalPages;
            })
            .addCase(fetchListings.rejected, (state, action) => {
                // state.loading = false;
                state.error = action.payload;
                console.log("Backend still waking up...");
            });
    }
});

export const { resetPagination } = listingSlice.actions;
export default listingSlice.reducer;