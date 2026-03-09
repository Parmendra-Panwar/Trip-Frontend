import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, signupApi, profileApi } from '../../services/authService';

// --- Thunks ---
export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try { return (await loginApi(data)).data; }
    catch (err) { return rejectWithValue(err.response?.data?.error || "Login Failed"); }
});

export const signupUser = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
    try { return (await signupApi(data)).data; }
    catch (err) { return rejectWithValue(err.response?.data?.error || "Signup Failed"); }
});

export const getProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
    try { return (await profileApi()).data; }
    catch (err) { return rejectWithValue("Session Expired"); }
});

// --- Slice ---
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
            // Pending for all
            .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
                state.loading = true;
                state.error = null;
            })
            // Login & Signup Success
            .addMatcher(
                (action) => [loginUser.fulfilled.type, signupUser.fulfilled.type].includes(action.type),
                (state, action) => {
                    state.loading = false;
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    localStorage.setItem('token', action.payload.token);
                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                }
            )
            // Profile Fetch Success
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                // Note: Token usually doesn't change on profile fetch
            })
            // Rejected for all
            .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;