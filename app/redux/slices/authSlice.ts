import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface User {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken?: string | null;
}

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
};

// ─────────────────────────────────────────────
// Async Actions
// ─────────────────────────────────────────────
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: unknown, thunkAPI) => {
    try {
      const data = await axiosInstance
        .post("/auth/login", credentials)
        .then((res) => res.data);

      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        (err instanceof Error && (err as { response?: { data?: { message?: string } } }).response?.data?.message) || "Login failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const data = await axiosInstance
        .get("/auth/session")
        .then((res) => res.data);

      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(
        (err instanceof Error && (err as { response?: { data?: { message?: string } } }).response?.data?.message) || "Login failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const data = await axiosInstance
    .post("/auth/logout")
    .then((res) => res.data);

  return data;
});

// ─────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      if (!state.user) state.user = {};
      state.user.token = action.payload;
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        state.user = action.payload.data;
        state.accessToken = action.payload.accessToken;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        state.user = action.payload.data;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;

        state.user = null;
        state.accessToken = null;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;

        state.loading = false;
        state.error = null;
      });
  },
});

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────
export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
