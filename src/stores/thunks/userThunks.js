// src/stores/thunks/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Đăng nhập
export const loginThunk = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await userService.login(credentials); // { accessToken, user }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// Đăng ký
export const registerThunk = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await userService.register(payload); // { success, message, data: { safeUser, accessToken } }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Register failed" });
    }
  }
);

// Refresh token
export const refreshTokenThunk = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      console.log("[Thunk] Calling /refresh-token ...");
      const res = await userService.refreshToken(); 
      // res = { success, message, data: { accessToken } }

      if (res?.data?.accessToken) {
        console.log("[Thunk] /refresh-token success:", res.data.accessToken);
        return { accessToken: res.data.accessToken }; // 🔑 normalize output
      } else {
        console.error("[Thunk] /refresh-token missing accessToken:", res);
        return rejectWithValue("Không nhận được accessToken mới");
      }
    } catch (err) {
      console.error("[Thunk] /refresh-token error:", err);
      return rejectWithValue(
        err.response?.data || { message: "Refresh token failed" }
      );
    }
  }
);

// Lấy profile
export const getProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile(); // { id, username, email, avatar, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Get profile failed" }
      );
    }
  }
);

// Cập nhật hồ sơ (bao gồm avatar)
export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(payload); // { success, message, data: { user } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Update profile failed" }
      );
    }
  }
);

// Đổi mật khẩu
export const changePasswordThunk = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      return await userService.changePassword(data); // { success, message, data: { accessToken } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Change password failed" }
      );
    }
  }
);

// Quên mật khẩu
export const forgotPasswordThunk = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await userService.forgotPassword(email); // { message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Forgot password failed" }
      );
    }
  }
);

// Reset mật khẩu
export const resetPasswordThunk = createAsyncThunk(
  "user/resetPassword",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      return await userService.resetPassword(token, data); // { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Reset password failed" }
      );
    }
  }
);
// Đăng xuất
export const logoutThunk = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Thunk logout")
      const data = await userService.logout();
      return data; // { message: "Logout success" }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);
