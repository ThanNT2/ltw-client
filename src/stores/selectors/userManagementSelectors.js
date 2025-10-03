// src/stores/selectors/userManagementSelectors.js

export const selectUserManagementState = (state) => state.userManagement;
export const selectUserList = (state) => state.userManagement.list;
export const selectUserPagination = (state) => state.userManagement.pagination;
export const selectUserFilters = (state) => state.userManagement.filters;
export const selectUserManagementLoading = (state) => state.userManagement.loading;
export const selectUserManagementError = (state) => state.userManagement.error;

// selector for updateUserByAdminThunk
export const selectUpdatedUser = (state) => state.userManagement.updatedUser;

//selector for deleteUserByAdminThunk
export const selectDeletedUser = (state) => state.userManagement.deletedUser;

//selector for restoreUserByAdminThunk
export const selectRestoredUser = (state) => state.userManagement.restoredUser;



