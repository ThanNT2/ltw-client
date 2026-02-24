// src/services/axiosInstance.js
import axios from "axios";
import store from "../stores";
import { refreshTokenThunk, logoutThunk } from "../stores/thunks/userThunks";

// Cờ chặn request khi đang logout
export const isForceLogout = { value: false };

// ✅ Refresh single-flight (queue)
let refreshPromise = null;

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

/* =========================================================
 * Helpers
 * ========================================================= */

const PUBLIC_ENDPOINTS = [
  "/users/login",
  "/users/register",
  "/users/refresh-token",
  "/users/forgot-password",
  "/users/reset-password",
];

const isPublicRequest = (url = "") => {
  return PUBLIC_ENDPOINTS.some((p) => url.includes(p));
};

const forceLogoutAndRedirect = async () => {
  if (isForceLogout.value) return;
  isForceLogout.value = true;

  try {
    // ✅ reset redux ngay để PrivateRoute không hiểu nhầm đang login
    store.dispatch({ type: "user/reset" });

    // cleanup storage
    localStorage.clear();
    sessionStorage.clear();

    // ❗HttpOnly cookie FE không xoá được
    // Nếu muốn xoá cookie refreshToken => gọi API logout (nhưng token có thể đã chết)
    await store.dispatch(logoutThunk(true));
  } finally {
    window.location.href = "/login";
  }
};

/* =========================================================
 * 🟢 REQUEST INTERCEPTOR
 * ========================================================= */
axiosInstance.interceptors.request.use(
  (config) => {
    if (isForceLogout.value) {
      throw new axios.Cancel("Force logout in progress");
    }

    const url = config.url || "";

    // ✅ Public API: tuyệt đối không gắn Authorization
    if (isPublicRequest(url)) {
      delete config.headers.Authorization;
      return config;
    }

    const token = store.getState()?.user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
 * 🔴 RESPONSE INTERCEPTOR (refresh queue)
 * ========================================================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isForceLogout.value) return Promise.reject(error);

    if (!error?.response) {
      // network error
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const originalRequest = error.config;

    const url = originalRequest?.url || "";
    const code = data?.code;

    // ✅ Public endpoint thì không refresh / không retry
    if (isPublicRequest(url)) {
      return Promise.reject(error);
    }

    // ✅ AUTH invalid -> logout luôn
    const AUTH_INVALID_CODES = [
      "USER_NOT_FOUND",
      "INVALID_TOKEN",
      "TOKEN_EXPIRED_AFTER_PASSWORD_CHANGE",
    ];

    if (status === 401 && AUTH_INVALID_CODES.includes(code)) {
      await forceLogoutAndRedirect();
      return Promise.reject(error);
    }

    // ✅ Access token expired -> refresh queue
    if (status === 401 && code === "TOKEN_EXPIRED") {
      // tránh loop retry vô hạn
      if (originalRequest._retry) {
        await forceLogoutAndRedirect();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        // ✅ SINGLE FLIGHT: chỉ 1 refresh đang chạy
        if (!refreshPromise) {
          refreshPromise = store.dispatch(refreshTokenThunk()).then((action) => {
            refreshPromise = null;

            if (!refreshTokenThunk.fulfilled.match(action)) {
              const msg = action?.payload?.message || "Refresh token failed";
              const err = new Error(msg);
              err.code = action?.payload?.code || "REFRESH_FAILED";
              throw err;
            }

            return action.payload?.accessToken;
          });
        }

        const newAccessToken = await refreshPromise;

        if (!newAccessToken) {
          throw new Error("Missing accessToken after refresh");
        }

        // retry request với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        await forceLogoutAndRedirect();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
