// src/services/userManagement.js
import axiosInstance from "./axiosInstance";

const ADMIN_API_URL = "/admin/users";

const userManagementService = {
  // Lấy danh sách người dùng (Admin)
  getAllUsersByAdmin: async ({
    page,
    limit,
    search,
    sort,
    role,
    isDeleted,
    fromDate,
    toDate,
    onlineStatus,
    includeInactive,
  } = {}) => {
    const params = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (role) params.role = role;
    if (isDeleted !== undefined) params.isDeleted = isDeleted;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (onlineStatus) params.onlineStatus = onlineStatus;
    if (includeInactive !== undefined) params.includeInactive = includeInactive;

    const response = await axiosInstance.get(ADMIN_API_URL, { params });
    return response.data; // { success, message, data }
  },
  //cập nhật thông tin users by Admin
  updateUserByAdmin: async (userId, payload = {}, file = null) => {
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    if (file) {
      formData.append("avatar", file);
    }
    const response = await axiosInstance.put(`${ADMIN_API_URL}/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data; // { success, message, data }
  },
  //xóa mềm users by Admin
  deleteUserByAdmin: async (userId) => {
    const response = await axiosInstance.delete(`${ADMIN_API_URL}/${userId}`, {
      withCredentials: true,
    });
    return response.data; // { success, message, data }
  },
};

export default userManagementService;


