import axios from "axios";
import store from "../stores";
import { refreshTokenThunk, logoutThunk } from "../stores/thunks/userThunks";

// Cờ ngăn chặn các request khi đang logout
export const isForceLogout = { value: false };

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

/* 🟢 REQUEST INTERCEPTOR */
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("📤 [REQUEST]", {
      url: config.url,
      headers: config.headers.Authorization,
    });
    if (isForceLogout.value) {
      console.warn("⛔ Bỏ qua request vì đang force logout");
      throw new axios.Cancel("Force logout in progress");
    }

    const state = store.getState();
    const token = state.user?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* 🔴 RESPONSE INTERCEPTOR */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isForceLogout.value) {
      console.warn("⛔ Bỏ qua interceptor vì đang force logout");
      return Promise.reject(error);
    }

    if (!error.response) return Promise.reject(error);

    const { status, data } = error.response;
    const originalRequest = error.config;

    /* 🚫 CASE 1 — User bị xóa, token invalid hoặc đổi mật khẩu sau khi cấp token */
    if (
      status === 401 &&
      ["USER_NOT_FOUND", "INVALID_TOKEN", "TOKEN_EXPIRED_AFTER_PASSWORD_CHANGE"].includes(data?.code)
    ) {
      console.warn("⚠️ Token không hợp lệ hoặc user đã bị xóa → force logout");
      isForceLogout.value = true;

      try {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        await store.dispatch(logoutThunk(true));
      } finally {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    /* 🔁 CASE 2 — Token hết hạn (JWT_EXPIRES_IN) → refresh */
    if (status === 401 && data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      console.log("🟡 [INTERCEPTOR] Access token expired → Try refresh...");

      originalRequest._retry = true;
      try {
        const resultAction = await store.dispatch(refreshTokenThunk());
        console.log("🧩 [REFRESH RESULT ACTION]", resultAction);
        if (refreshTokenThunk.fulfilled.match(resultAction)) {
          const newAccessToken = resultAction.payload?.accessToken;
          console.log("✅ [NEW ACCESS TOKEN]", newAccessToken);
          if (!newAccessToken) throw new Error("Không có accessToken mới từ server");

          // Gắn token mới cho các request sau
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("🔁 [RETRY REQUEST]", originalRequest.url);
          // Gọi lại request cũ
          return axiosInstance(originalRequest);
        } else {
          console.warn("⚠️ Refresh token thất bại → logout");
          await store.dispatch(logoutThunk(true));
          window.location.href = "/login";
        }
      } catch (refreshError) {
        console.warn("⚠️ Refresh token error:", refreshError);
        await store.dispatch(logoutThunk(true));
        window.location.href = "/login";
      }
    }

    /* ❌ CASE 3 — Các lỗi khác */
    return Promise.reject(error);
  }
);

export default axiosInstance;
