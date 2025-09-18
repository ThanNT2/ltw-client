// src/services/userService.js
import axiosInstance from "./axiosInstance";

const API_URL = "/users"; // chỉnh theo env nếu cần

const userService = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await axiosInstance.post(`${API_URL}/login`, credentials, {
      withCredentials: true,
    });
    return response.data; // { accessToken, user }
  },

  // Refresh token (axiosInstance sẽ tự gọi khi cần, nhưng cũng viết ở đây cho Redux thunk dùng)
  refreshToken: async () => {
    const response = await axiosInstance.post(
      `${API_URL}/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data; // { accessToken }
  },

  // Đăng xuất
  logout: async () => {
    const response = await axiosInstance.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data; // { message: "Logout success" }
  },

  // Lấy thông tin user hiện tại
  getProfile: async () => {
    const response = await axiosInstance.get(`${API_URL}/profile`);
    console.log("API =", response.data);
    return response.data; // { id, username, email, avatar, ... }
  },

  // Đổi mật khẩu
  changePassword: async (data) => {
    const response = await axiosInstance.post(`${API_URL}/change-password`, data);
    return response.data; // { message: "Password changed successfully" }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await axiosInstance.post(`${API_URL}/forgot-password`, {
      email,
    });
    return response.data; // { message: "Reset link sent" }
  },

  // Reset mật khẩu từ token
  resetPassword: async (token, data) => {
    const response = await axiosInstance.post(
      `${API_URL}/reset-password/${token}`,
      data
    );
    return response.data; // { message: "Password reset successfully" }
  },
};

export default userService;
