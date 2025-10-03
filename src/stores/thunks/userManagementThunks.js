// src/stores/thunks/userManagementThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import userManagementService from "../../services/userManagement";

// Lấy danh sách người dùng (Admin)
export const getAllUsersByAdminThunk = createAsyncThunk(
  "userManagement/getAllUsersByAdmin",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await userManagementService.getAllUsersByAdmin(params);
      return res; // { success, message, data }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Fetch users by admin failed" }
      );
    }
  }
);


// Cập nhật thông tin người dùng (Admin)
export const updateUserByAdminThunk = createAsyncThunk(
  "userManagement/updateUserByAdmin",
  async ({ userId, payload, file }, { rejectWithValue }) => {
    try {
      const res = await userManagementService.updateUserByAdmin(userId, payload, file);
      return res; // { success, message, data }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Update user by admin failed" }
      );
    }
  }
);

// Xóa người dùng (Admin) - soft delete
export const softDeleteUserByAdminThunk = createAsyncThunk(
  "userManagement/softDeleteUserByAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await userManagementService.deleteUserByAdmin(userId);
      return res; // { success, message, data }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Soft delete user by admin failed" }
      );
    }
  }
);
//restore người dùng (Admin)
export const restoreUserByAdminThunk = createAsyncThunk(
  "userManagement/restoreUserByAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await userManagementService.restoreUserByAdmin(userId);
      return res; // { success, message, data }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: "Restore user by admin failed" }
      );
    }
  }
);
