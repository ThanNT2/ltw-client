// src/features/vaults/vaultSelectors.js

// Lấy toàn bộ state vaultMaster
export const selectVaultState = (state) => state.vaultMaster;

// Lấy danh sách balances
export const selectVaultBalances = (state) => state.vaultMaster.balances;

// Lấy locks từ state
export const selectVaultLocks = (state) => state.vaultMaster.locks;

// Lấy chi tiết các vault con
export const selectVaultDetails = (state) => state.vaultMaster.details;

// Lấy trạng thái loading
export const selectVaultLoading = (state) => state.vaultMaster.loading;

// Lấy lỗi
export const selectVaultError = (state) => state.vaultMaster.error;

// Lấy message thành công
export const selectVaultSuccessMessage = (state) =>
    state.vaultMaster.successMessage;

// Lấy tổng số dư tất cả vaults (tùy nhu cầu)
export const selectVaultTotalBalance = (state) =>
    state.vaultMaster.balances.reduce((sum, vault) => sum + (vault.balance || 0), 0);
