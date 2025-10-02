// src/stores/slices/userManagementSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getAllUsersByAdminThunk, updateUserByAdminThunk, softDeleteUserByAdminThunk } from "../thunks/userManagementThunks";

const initialState = {
  list: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    sort: undefined,
    role: undefined,
    isDeleted: undefined,
    fromDate: undefined,
    toDate: undefined,
    onlineStatus: undefined,
    includeInactive: undefined,
  },
  loading: false,
  error: null,
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination(state, action) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // API format: { success, message, data: { items, pagination } }
        const payload = action.payload?.data || {};
        const { items, pagination } = payload;

        state.list = Array.isArray(items) ? items : [];

        if (pagination) {
          state.pagination.page = pagination.page ?? state.pagination.page;
          state.pagination.limit = pagination.limit ?? state.pagination.limit;
          state.pagination.total = pagination.total ?? 0;
          state.pagination.totalPages = pagination.totalPages ?? 0;
        }
      })
      .addCase(getAllUsersByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Tải danh sách người dùng thất bại";
      })
      // update user by Admin
      .addCase(updateUserByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Cập nhật người dùng thất bại";
      })
      //xóa mềm users by admin
      .addCase(softDeleteUserByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteUserByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(softDeleteUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Xóa mềm người dùng thất bại";
      })
  },
});

export const { setFilters, setPagination, resetState } = userManagementSlice.actions;
export default userManagementSlice.reducer;


