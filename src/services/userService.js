// src/services/userService.js
import axiosInstance from "./axiosInstance";

const API_URL = "/users"; // chỉnh theo env nếu cần

const userService = {
  // Đăng ký
  register: async (payload) => {
    const response = await axiosInstance.post(`${API_URL}/register`, payload, {
      withCredentials: true,
    });
    return response.data; // { success, message, data: { safeUser, accessToken } }
  },
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

  // Cập nhật hồ sơ (hỗ trợ upload avatar)
  updateProfile: async ({ username, phone, avatarFile, removeAvatar = false }) => {
    const formData = new FormData();
    if (username !== undefined) formData.append("username", username);
    if (phone !== undefined) formData.append("phone", phone);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    } else if (removeAvatar) {
      formData.append("avatar", ""); // server sẽ hiểu là xoá avatar
    }

    const response = await axiosInstance.put(`${API_URL}/profile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data; // { success, message, data: { user } }
  },

  // Đổi mật khẩu
  changePassword: async (data) => {
    const response = await axiosInstance.post(`${API_URL}/change-password`, data);
    return response.data; // { success, message, data: { accessToken } }
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
    return response.data; // { success, message }
  },
};

export default userService;
