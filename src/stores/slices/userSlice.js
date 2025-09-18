// src/stores/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  refreshTokenThunk,
  logoutThunk,
} from "../thunks/userThunks";

const initialState = {
  isAuthenticated: false,
  currentUser: null,
  accessToken: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // có thể thêm reducers sync nếu cần
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.data.accessToken;
        console.log("slice =", action.payload.data)
        state.currentUser = action.payload.data.user;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
        state.isAuthenticated = false;
      })

      // 🔹 Refresh token
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        console.log("slice =", action.payload.data)

        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.currentUser = null;
      })

      // 🔹 Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // vẫn clear luôn cho chắc chắn
        state.currentUser = null;
        state.accessToken = null;
      });
  },
});

export default userSlice.reducer;
