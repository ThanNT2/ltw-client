// src/stores/selectors/userSelectors.js

export const selectAccessToken = (state) => state.user?.accessToken || null;

export const selectTokenExpiresAt = (state) => state.user?.tokenExpiresAt || null;

/**
 * ✅ Authenticated khi:
 * - Có accessToken
 * - Và tokenExpiresAt chưa hết hạn (nếu tồn tại)
 *
 * NOTE:
 * - tokenExpiresAt bạn đang lưu dạng ms (epoch)
 */
export const selectIsAuthenticated = (state) => {
  const token = state.user?.accessToken;
  const expiresAt = state.user?.tokenExpiresAt;

  if (!token) return false;

  // Nếu chưa lưu expiresAt => coi như có token là authenticated (fallback)
  if (!expiresAt) return true;

  return Date.now() < expiresAt;
};

export const selectCurrentUser = (state) => state.user?.currentUser || null;

export const selectUserLoading = (state) => state.user?.loading || false;

export const selectUserError = (state) => state.user?.error || null;

// ⚠️ cái này bạn đang return state.user.logout nhưng slice không có field logout
// export const selectUserLogout = (state) => state.user.logout;
