// src/stores/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  refreshTokenThunk,
  logoutThunk,
  changePasswordThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
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
      })
      // 🔹 Change password → nhận accessToken mới
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const newToken = action.payload?.data?.accessToken;
        if (newToken) {
          state.accessToken = newToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đổi mật khẩu thất bại";
      })

      // 🔹 Forgot password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Yêu cầu quên mật khẩu thất bại";
      })

      // 🔹 Reset password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Không tự đăng nhập; người dùng sẽ đăng nhập lại thủ công
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đặt lại mật khẩu thất bại";
      });
  },
});

export default userSlice.reducer;
