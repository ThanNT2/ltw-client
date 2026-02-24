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

  // ✅ thêm để PrivateRoute check expiry
  tokenExpiresAt: null,

  loading: false,
  error: null,

  // 🧠 Realtime tracking
  onlineUsers: [],
  lastSocketEvent: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },

    updateUserRealtime(state, action) {
      const updated = action.payload;
      const curr = state.currentUser;

      if (curr && (curr._id === updated._id || curr.id === updated._id)) {
        state.currentUser = { ...curr, ...updated };

        if (updated.isActive === false || updated.isDeleted === true) {
          state.isAuthenticated = false;
          state.accessToken = null;
          state.tokenExpiresAt = null;
          state.currentUser = null;
        }
      }

      state.lastSocketEvent = {
        type: "user_updated",
        payload: updated,
        time: new Date().toISOString(),
      };
    },

    reset: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      /* =========================
       * LOGIN
       * ========================= */
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        state.accessToken = action.payload?.data?.accessToken || null;
        state.currentUser = action.payload?.data?.user || null;

        // ✅ set expiresAt
        state.tokenExpiresAt = action.payload?.data?.expiresIn || null;

        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";

        state.isAuthenticated = false;
        state.accessToken = null;
        state.tokenExpiresAt = null;
        state.currentUser = null;
      })

      /* =========================
       * REGISTER
       * ========================= */
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ register trả token => tự login luôn
        state.isAuthenticated = true;

        state.accessToken = action.payload?.data?.accessToken || null;
        state.currentUser = action.payload?.data?.user || null;

        // ✅ set expiresAt
        state.tokenExpiresAt = action.payload?.data?.expiresIn || null;

        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký thất bại";

        state.isAuthenticated = false;
        state.accessToken = null;
        state.tokenExpiresAt = null;
        state.currentUser = null;
      })

      /* =========================
       * REFRESH TOKEN
       * ========================= */
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload?.accessToken || null;
        state.tokenExpiresAt = action.payload?.expiresIn || null;

        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.tokenExpiresAt = null;
        state.currentUser = null;
        state.error = action.payload || "Refresh token failed";
      })

      /* =========================
       * LOGOUT
       * ========================= */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.accessToken = null;
        state.tokenExpiresAt = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        // clear luôn cho chắc chắn
        state.isAuthenticated = false;
        state.currentUser = null;
        state.accessToken = null;
        state.tokenExpiresAt = null;
      })

      /* =========================
       * CHANGE PASSWORD
       * ========================= */
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const newToken = action.payload?.data?.accessToken;
        const expiresIn = action.payload?.data?.expiresIn;

        if (newToken) {
          state.accessToken = newToken;
          state.tokenExpiresAt = expiresIn || null;
          state.isAuthenticated = true;
        }
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đổi mật khẩu thất bại";
      })

      /* =========================
       * FORGOT PASSWORD
       * ========================= */
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

      /* =========================
       * RESET PASSWORD
       * ========================= */
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;

        state.isAuthenticated = false;
        state.accessToken = null;
        state.tokenExpiresAt = null;
        state.currentUser = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đặt lại mật khẩu thất bại";
      })

      /* =========================
       * GET PROFILE
       * ========================= */
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload?.data || state.currentUser;

        // ⚠️ chỉ set true nếu đang có token
        if (state.accessToken) state.isAuthenticated = true;
      })

      /* =========================
       * UPDATE PROFILE
       * ========================= */
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
  reset,
} = userSlice.actions;

export default userSlice.reducer;
