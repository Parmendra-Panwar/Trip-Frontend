import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createActivityApi } from '../../services/activityService';

export const submitNewActivity = createAsyncThunk(
    'createActivity/submit',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await createActivityApi(formData);
            return response.data;
        } catch (err) {
            console.error("API Error:", err.response?.data);
            return rejectWithValue(err.response?.data?.error || "Failed to publish activity");
        }
    }
);

const createActivitySlice = createSlice({
    name: 'createActivity',
    initialState: {
        uploading: false,
        success: false,
        error: null,
    },
    reducers: {
        resetCreateActivityState: (state) => {
            state.uploading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitNewActivity.pending, (state) => {
                state.uploading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitNewActivity.fulfilled, (state) => {
                state.uploading = false;
                state.success = true;
            })
            .addCase(submitNewActivity.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            });
    }
});

export const { resetCreateActivityState } = createActivitySlice.actions;
export default createActivitySlice.reducer;
