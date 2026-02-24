// src/stores/thunks/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

/* =========================================================
 * Helpers
 * ========================================================= */

/**
 * Chuẩn hóa error trả về từ axios
 * - Luôn đảm bảo có message
 * - Giữ code/status nếu backend trả
 */
const normalizeError = (err, fallbackMessage = "Request failed") => {
  const res = err?.response;

  // Backend trả error chuẩn: { success:false, message, code, ... }
  if (res?.data) {
    return {
      ...res.data,
      status: res.status,
      message: res.data?.message || fallbackMessage,
    };
  }

  // Axios không có response (network error)
  return {
    success: false,
    message: err?.message || fallbackMessage,
    code: "NETWORK_ERROR",
    status: 0,
  };
};

/**
 * Chuẩn hóa response success cho Redux
 * server nên trả: { success, message, data }
 */
const normalizeSuccess = (res) => {
  // đảm bảo luôn có shape { success, message, data }
  return {
    success: !!res?.success,
    message: res?.message || "",
    data: res?.data ?? null,
  };
};

/* =========================================================
 * THUNKS
 * ========================================================= */

// ✅ LOGIN
export const loginThunk = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await userService.login(credentials);
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Login failed"));
    }
  }
);

// ✅ REGISTER
export const registerThunk = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      // server: { success, message, data: { user, accessToken, expiresIn, reward } }
      const res = await userService.register(payload);
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Register failed"));
    }
  }
);

// ✅ REFRESH TOKEN
export const refreshTokenThunk = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.refreshToken();
      // expect: { success, message, data: { accessToken, expiresIn } }

      const { accessToken, expiresIn } = res?.data || {};

      if (!accessToken) {
        return rejectWithValue({
          success: false,
          message: "Không nhận được accessToken mới",
          code: "INVALID_REFRESH_RESPONSE",
        });
      }

      return {
        accessToken,
        expiresIn: expiresIn || null,
      };
    } catch (err) {
      // Backend refresh nên trả: { message, code:"TOKEN_EXPIRED" ... }
      return rejectWithValue(normalizeError(err, "Refresh token failed"));
    }
  }
);

// ✅ GET PROFILE
export const getProfileThunk = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getProfile();
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Get profile failed"));
    }
  }
);

// ✅ UPDATE PROFILE
export const updateProfileThunk = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userService.updateProfile(payload);
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Update profile failed"));
    }
  }
);

// ✅ CHANGE PASSWORD
export const changePasswordThunk = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await userService.changePassword(data);
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Change password failed"));
    }
  }
);

// ✅ FORGOT PASSWORD
export const forgotPasswordThunk = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await userService.forgotPassword(email);
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Forgot password failed"));
    }
  }
);

// ✅ RESET PASSWORD
export const resetPasswordThunk = createAsyncThunk(
  "user/resetPassword",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const res = await userService.resetPassword(token, data);
      return normalizeSuccess(res);
    } catch (err) {
      return rejectWithValue(normalizeError(err, "Reset password failed"));
    }
  }
);

// ✅ LOGOUT
export const logoutThunk = createAsyncThunk(
  "user/logout",
  /**
   * @param {boolean} skipApi - true => force logout (không gọi API)
   */
  async (skipApi = false, { dispatch, rejectWithValue }) => {
    try {
      if (!skipApi) {
        await userService.logout();
      }
    } catch (err) {
      // Logout fail thường không critical
      // nhưng vẫn reject để dev debug nếu muốn
      // -> KHÔNG reject nếu 401 (token hết hạn) để cleanup vẫn chạy
      if (err?.response?.status !== 401) {
        console.warn("⚠️ Logout API failed:", err?.response?.data || err?.message);
      }
    }

    try {
      // cleanup client
      localStorage.clear();
      sessionStorage.clear();

      // reset redux
      dispatch({ type: "user/reset" });
      dispatch({ type: "userManagement/reset" });
      dispatch({ type: "notification/reset" });
      dispatch({ type: "socket/reset" });

      return { success: true, message: "Logout success" };
    } catch (err) {
      return rejectWithValue({
        success: false,
        message: "Logout failed during cleanup",
        code: "LOGOUT_CLEANUP_FAILED",
      });
    }
  }
);
