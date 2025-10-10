// src/stores/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  registerThunk,
  refreshTokenThunk,
  logoutThunk,
  changePasswordThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  getProfileThunk,
  updateProfileThunk,
} from "../thunks/userThunks";

const initialState = {
  isAuthenticated: false,
  currentUser: null,
  accessToken: null,
  loading: false,
  error: null,
  onlineUsers: [], // danh sách userId đang online
  lastSocketEvent: null, // debug hoặc tracking
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // có thể thêm reducers sync nếu cần
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    // --- 🧠 Realtime reducers ---
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // mảng userId
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    // Cập nhật role/user info realtime
    updateUserRealtime: (state, action) => {
      const updatedData = action.payload;
      if (state.currentUser && state.currentUser._id === updatedData._id) {
        state.currentUser = {
          ...state.currentUser,
          ...updatedData,
        };
      }
      state.lastSocketEvent = {
        type: "user_updated",
        time: new Date().toISOString(),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.data.accessToken;
        state.currentUser = action.payload.data.user;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
        state.isAuthenticated = false;
      })

      // 🔹 Register (xử lý tương tự login)
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.data?.accessToken;
        state.currentUser = action.payload.data?.safeUser || null;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký thất bại";
        state.isAuthenticated = false;
      })

      // 🔹 Refresh token
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        console.log("slice =", action.payload.data)

        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.currentUser = null;
      })

      // 🔹 Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // vẫn clear luôn cho chắc chắn
        state.currentUser = null;
        state.accessToken = null;
      })
      // 🔹 Change password → nhận accessToken mới
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const newToken = action.payload?.data?.accessToken;
        if (newToken) {
          state.accessToken = newToken;
          state.isAuthenticated = true;
        }
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đổi mật khẩu thất bại";
      })

      // 🔹 Forgot password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Yêu cầu quên mật khẩu thất bại";
      })

      // 🔹 Reset password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Không tự đăng nhập; người dùng sẽ đăng nhập lại thủ công
        state.isAuthenticated = false;
        state.accessToken = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đặt lại mật khẩu thất bại";
      })

      // 🔹 Get profile → đồng bộ user
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload?.data || state.currentUser;
        state.isAuthenticated = true;
      })

      // 🔹 Update profile → cập nhật user (kể cả avatar)
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedUser = action.payload?.data?.user;
        if (updatedUser) state.currentUser = updatedUser;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Cập nhật thông tin thất bại";
      });
  },
});
export const {
  setCurrentUser,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  updateUserRealtime,
} = userSlice.actions;
export default userSlice.reducer;
