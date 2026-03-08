import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, signupApi } from '../../services/authService';

// --- Thunks (Async Logic) ---
export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const response = await loginApi(data);
        return response.data; // { user, token }
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || "Login failed");
    }
});

// --- Slice (State Logic) ---
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.clear();
        },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;