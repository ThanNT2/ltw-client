// src/services/axiosInstance.js
import axios from "axios";
import store from "../stores";
import { refreshTokenThunk, logoutThunk } from "../stores/thunks/userThunks";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api", // có thể đổi sang process.env.REACT_APP_API_URL
  withCredentials: true, // gửi kèm cookie refreshToken (HttpOnly)
});

// 🟢 Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.accessToken;

    console.log("🔵 [Axios][Request]", {
      url: config.url,
      method: config.method,
      accessToken: token ? token.slice(0, 20) + "..." : "❌ NO TOKEN",
    });

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ [Axios][Request Error]", error);
    return Promise.reject(error);
  }
);

// 🔴 Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("🟢 [Axios][Response OK]", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("❌ [Axios][Network Error]", error.message);
      return Promise.reject(error);
    }

    console.warn("🟠 [Axios][Response Error]", {
      url: originalRequest?.url,
      status: error.response.status,
      data: error.response.data,
    });

    // Nếu AccessToken hết hạn → thử refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("⚠️ [Axios][401] Token hết hạn → gọi refreshToken...");

      try {
        const resultAction = await store.dispatch(refreshTokenThunk());

        if (refreshTokenThunk.fulfilled.match(resultAction)) {
          const newAccessToken = resultAction.payload?.accessToken;

          if (!newAccessToken) {
            throw new Error("Refresh thành công nhưng không có accessToken mới");
          }

          console.log("✅ [Axios][Refresh thành công]", {
            newAccessToken: newAccessToken.slice(0, 20) + "...",
          });

          // Gắn lại accessToken mới cho axios
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          console.log("🔄 [Axios][Retry Request]", originalRequest.url);

          return axiosInstance(originalRequest);
        } else {
          console.error("❌ [Axios][Refresh thất bại] → logout");
          store.dispatch(logoutThunk());
        }
      } catch (refreshError) {
        console.error("❌ [Axios][Refresh Exception]", refreshError);
        store.dispatch(logoutThunk());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
