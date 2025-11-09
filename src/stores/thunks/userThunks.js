// src/stores/thunks/userThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { isForceLogout } from "../../services/axiosInstance";

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
      // Expect: { success, data: { accessToken, expiresIn } }
      console.log("[Thunk] Response /refresh-token:", res);

      const { accessToken, expiresIn } = res?.data || {};

      if (accessToken) {
        console.log("[Thunk] /refresh-token success:", {
          accessToken,
          expiresIn,
        });
        // ✅ Trả về cả expiresIn để lưu lại trong Redux
        return { accessToken, expiresIn };
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
// Đăng xuất (chuẩn hóa & dọn sạch toàn bộ)
export const logoutThunk = createAsyncThunk(
  "user/logout",
  /**
   * @param {boolean} skipApi - Nếu true → không gọi API /logout (dành cho force logout)
   */
  async (skipApi = false, { dispatch, rejectWithValue }) => {
    console.log("🚪 [Thunk] Logging out...", { skipApi });

    try {
      if (!skipApi) {
        // 🟢 Gọi API logout bình thường
        await userService.logout();
      } else {
        console.warn("⚠️ Force logout: bỏ qua gọi API /logout");
      }
    } catch (error) {
      if (!error?.response || error.response?.status !== 401) {
        console.warn("⚠️ Logout API failed (token có thể đã hết hạn)");
      }
    }

    try {
      /* 🧹 Xóa toàn bộ dữ liệu phía client */
      localStorage.clear();
      sessionStorage.clear();

      // Xóa cookies (bao gồm token hoặc session nếu có)
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        }
      }

      /* 🔄 Reset toàn bộ Redux slices */
      dispatch({ type: "user/reset" });
      dispatch({ type: "userManagement/reset" });
      dispatch({ type: "notification/reset" });
      dispatch({ type: "socket/reset" });

      /* 🚫 Đặt lại trạng thái force logout */
      isForceLogout.value = false;

      console.log("✅ [Thunk] Logout cleanup done.");

      /* 🔁 Redirect về trang login nếu đang ở private route */
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return { message: "Logout success" };
    } catch (error) {
      console.error("❌ [Thunk] Logout cleanup failed:", error);
      return rejectWithValue("Logout failed during cleanup");
    }
  }
);

