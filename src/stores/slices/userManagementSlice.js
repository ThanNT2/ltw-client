// src/stores/slices/userManagementSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsersByAdminThunk,
  updateUserByAdminThunk,
  softDeleteUserByAdminThunk,
  restoreUserByAdminThunk,
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

    /** ✅ Realtime cập nhật online/offline */
    setOnlineUsers(state, action) {
      const onlineIds = action.payload || [];
      console.log("✅ Socket update online users:", onlineIds);
      state.onlineUsers = onlineIds;
      state.list = state.list.map((u) => ({
        ...u,
        onlineStatus: onlineIds.includes(u._id || u.id) ? "online" : "offline",
      }));
    },

    addOnlineUser(state, action) {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
      state.list = state.list.map((u) =>
        (u._id || u.id) === userId ? { ...u, onlineStatus: "online" } : u
      );
    },

    removeOnlineUser(state, action) {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      state.list = state.list.map((u) =>
        (u._id || u.id) === userId ? { ...u, onlineStatus: "offline" } : u
      );
    },

    /** ⚡ NEW: Realtime cập nhật khi role hoặc profile user thay đổi */
    updateUserRealtime(state, action) {
      const updatedUser = action.payload;
      if (!updatedUser?._id && !updatedUser?.id) return;

      const targetId = updatedUser._id || updatedUser.id;
      const idx = state.list.findIndex(
        (u) => (u._id || u.id) === targetId
      );
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...updatedUser };
        console.log("⚡ Updated user realtime:", updatedUser);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      /** ---- GET ALL ---- */
      .addCase(getAllUsersByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload?.data || {};
        const { items, pagination } = payload;
        state.list = Array.isArray(items) ? items : [];

        if (pagination) {
          state.pagination = {
            page: pagination.page ?? 1,
            limit: pagination.limit ?? 10,
            total: pagination.total ?? 0,
            totalPages: pagination.totalPages ?? 0,
          };
        } else {
          state.pagination = { page: 1, limit: 10, total: 0, totalPages: 0 };
        }
      })
      .addCase(getAllUsersByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Tải danh sách người dùng thất bại";
      })

      /** ---- UPDATE USER ---- */
      .addCase(updateUserByAdminThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.data;
        const updatedId =
          updatedUser?._id || updatedUser?.id || action.meta.arg?.id;

        state.list = state.list.map((u) =>
          (u._id || u.id) === updatedId
            ? { ...u, ...updatedUser }
            : u
        );
      })
      .addCase(updateUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Cập nhật người dùng thất bại";
      })

      /** ---- SOFT DELETE ---- */
      .addCase(softDeleteUserByAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(softDeleteUserByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.data;
        const deletedId =
          updatedUser?._id || updatedUser?.id || action.meta.arg;
        state.list = state.list.map((u) =>
          (u._id || u.id) === deletedId
            ? updatedUser
              ? { ...u, ...updatedUser }
              : { ...u, isDeleted: true, isActive: false }
            : u
        );
      })
      .addCase(softDeleteUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Xóa mềm người dùng thất bại";
      })

      /** ---- RESTORE ---- */
      .addCase(restoreUserByAdminThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreUserByAdminThunk.fulfilled, (state, action) => {
        state.loading = false;
        const restoredUser = action.payload?.data;
        const restoredId =
          restoredUser?._id || restoredUser?.id || action.meta.arg;

        state.list = state.list.map((u) =>
          (u._id || u.id) === restoredId
            ? restoredUser
              ? { ...u, ...restoredUser }
              : { ...u, isDeleted: false, isActive: true }
            : u
        );
      })
      .addCase(restoreUserByAdminThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Khôi phục người dùng thất bại";
      });
  },
});

export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setFilters,
  setPagination,
  resetState,
  updateUserRealtime, // 👈 thêm export này
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
