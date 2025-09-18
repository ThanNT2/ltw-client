// src/stores/selectors/userSelectors.js

export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export const selectCurrentUser = (state) => state.user.currentUser;

export const selectAccessToken = (state) => {
  console.log("🔍 Selector accessToken:", state.user.accessToken);
  return state.user.accessToken;
};

export const selectUserLoading = (state) => state.user.loading;

export const selectUserError = (state) => state.user.error;
