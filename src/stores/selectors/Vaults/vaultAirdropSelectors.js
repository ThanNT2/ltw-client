// src/store/vaultAirdrop/vaultAirdropSelectors.js
import { createSelector } from "@reduxjs/toolkit";

/* ======================================================
 * BASE SELECTOR
 * ====================================================== */
const selectVaultAirdropState = (state) => state.vaultAirdrop;

/* ======================================================
 * BASIC SELECTORS
 * ====================================================== */
export const selectVaultAirdropDetails = createSelector(
    [selectVaultAirdropState],
    (vaultAirdrop) => vaultAirdrop.details
);

export const selectVaultAirdropAuditLogs = createSelector(
    [selectVaultAirdropState],
    (vaultAirdrop) => vaultAirdrop.auditLogs
);

export const selectVaultAirdropLoading = createSelector(
    [selectVaultAirdropState],
    (vaultAirdrop) => vaultAirdrop.loading
);

export const selectVaultAirdropActionLoading = createSelector(
    [selectVaultAirdropState],
    (vaultAirdrop) => vaultAirdrop.actionLoading
);

export const selectVaultAirdropError = createSelector(
    [selectVaultAirdropState],
    (vaultAirdrop) => vaultAirdrop.error
);

/* ======================================================
 * DERIVED SELECTORS (tính toán từ details)
 * ====================================================== */

/* 💰 Tổng ngân sách */
export const selectTotalBudget = createSelector(
    [selectVaultAirdropDetails],
    (details) => details?.totalBudget ?? 0
);

/* 📤 Đã phân phối */
export const selectDistributedAmount = createSelector(
    [selectVaultAirdropDetails],
    (details) => details?.distributed ?? 0
);

/* 📥 Ngân sách còn lại */
export const selectRemainingBudget = createSelector(
    [selectTotalBudget, selectDistributedAmount],
    (total, distributed) =>
        total === null ? null : Math.max(total - distributed, 0)
);

/* 🚫 Vault có bị khoá không */
export const selectIsVaultLocked = createSelector(
    [selectVaultAirdropDetails],
    (details) => Boolean(details?.isLocked)
);

/* 📊 Có audit logs không */
export const selectHasAuditLogs = createSelector(
    [selectVaultAirdropAuditLogs],
    (logs) => logs && logs.length > 0
);

/* ======================================================
 * UI HELPERS
 * ====================================================== */

/* ⏳ Disable button khi đang xử lý */
export const selectVaultActionDisabled = createSelector(
    [selectVaultAirdropActionLoading, selectIsVaultLocked],
    (loading, locked) => loading || locked
);
