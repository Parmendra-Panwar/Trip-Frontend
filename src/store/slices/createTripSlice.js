import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createTripApi } from '../../services/tripService';

export const submitNewTrip = createAsyncThunk(
    'createTrip/submit',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await createTripApi(formData);
            return response.data;
        } catch (err) {
            console.error("API Error:", err.response?.data);
            return rejectWithValue(err.response?.data?.error || "Failed to publish trip");
        }
    }
);

const createTripSlice = createSlice({
    name: 'createTrip',
    initialState: {
        uploading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetCreateTripState: (state) => {
            state.uploading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitNewTrip.pending, (state) => {
                state.uploading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitNewTrip.fulfilled, (state) => {
                state.uploading = false;
                state.success = true;
            })
            .addCase(submitNewTrip.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            });
    }
});

export const { resetCreateTripState } = createTripSlice.actions;
export default createTripSlice.reducer;
