// src/stores/slices/userManagementSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsersByAdminThunk,
  updateUserByAdminThunk,
  softDeleteUserByAdminThunk,
  restoreUserByAdminThunk
} from "../thunks/userManagementThunks";

const initialState = {
  list: [],
  onlineUsers: [],
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

    // ✅ thêm reducers realtime
    setOnlineUsers(state, action) {
      const onlineIds = action.payload || [];
      console.log("✅ Socket update online users vcl:", onlineIds);
      state.onlineUsers = onlineIds;

      // Cập nhật trạng thái online của từng user trong list
      state.list = state.list.map((u) => ({
        ...u,
        onlineStatus: onlineIds.includes(u.id || u._id) ? "online" : "offline",
      }));
    },

    addOnlineUser(state, action) {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
      state.list = state.list.map((u) =>
        (u.id || u._id) === userId ? { ...u, onlineStatus: "online" } : u
      );
    },

    removeOnlineUser(state, action) {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      state.list = state.list.map((u) =>
        (u.id || u._id) === userId ? { ...u, onlineStatus: "offline" } : u
      );
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
        } else {
          state.pagination.page = 1;
          state.pagination.limit = 10;
          state.pagination.total = 0;
          state.pagination.totalPages = 0;
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
        // User từ API (nếu có)
        const updatedUser = action.payload?.data;

        // ID lấy từ payload hoặc fallback từ meta.arg
        const updatedId = updatedUser?._id || updatedUser?.id || action.meta.arg?.id;

        state.list = state.list.map((u) =>
          u._id === updatedId || u.id === updatedId
            ? updatedUser
              ? { ...u, ...updatedUser } // ✅ merge theo API trả về
              : { ...u, ...action.meta.arg?.data } // ✅ fallback merge theo dữ liệu client gửi
            : u
        );
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
        // Nếu API có trả về user (đầy đủ fields)
        const updatedUser = action.payload?.data;

        // Lấy ID từ payload hoặc fallback về arg
        const deletedId = updatedUser?._id || updatedUser?.id || action.meta.arg;

        state.list = state.list.map((u) =>
          u._id === deletedId || u.id === deletedId
            ? updatedUser
              // ✅ Trường hợp API trả user -> merge để đồng bộ chính xác
              ? { ...u, ...updatedUser }
              // ✅ Trường hợp API chỉ trả success=true -> update thủ công
              : { ...u, isDeleted: true, isActive: false }
            : u
        );
      })
      .addCase(softDeleteUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Xóa mềm người dùng thất bại";
      })
      //khoi phuc users by admin
      .addCase(restoreUserByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreUserByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Nếu API có trả về user (đầy đủ fields)
        const restoredUser = action.payload?.data;

        // Lấy ID từ payload hoặc fallback từ arg
        const restoredId = restoredUser?._id || restoredUser?.id || action.meta.arg;

        state.list = state.list.map((u) =>
          u._id === restoredId || u.id === restoredId
            ? restoredUser
              // ✅ Nếu có user từ API → merge để không mất field
              ? { ...u, ...restoredUser }
              // ✅ Nếu API chỉ trả success=true → fallback thủ công
              : { ...u, isDeleted: false, isActive: true }
            : u
        );
      })
      .addCase(restoreUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Khoi phuc người dùng thất bại";
      });
  },
});

export const {
  setList,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setFilters,
  setPagination,
  resetState
} = userManagementSlice.actions;
export default userManagementSlice.reducer;


