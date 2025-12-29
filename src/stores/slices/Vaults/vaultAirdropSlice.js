// src/store/vaultAirdrop/vaultAirdropSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    fetchVaultAirdropDetails,
    allocateBudget,
    addBudget,
    distributeReward,
    resetDailyCheckin,
    fetchAuditLogs,
} from "../../thunks/Vaults/vaultAirdropThunks";

/* -------------------------------------------------------
 * Initial State
 * ----------------------------------------------------- */
const initialState = {
    details: null,
    auditLogs: [],
    loading: false,        // load page
    actionLoading: false,  // mutate actions
    error: null,
};

/* -------------------------------------------------------
 * Helpers (Matchers)
 * ----------------------------------------------------- */
const mutationThunks = [
    allocateBudget,
    addBudget,
    distributeReward,
    resetDailyCheckin,
];

const isMutationPending = (action) =>
    mutationThunks.some((thunk) => action.type === thunk.pending.type);

const isMutationFulfilled = (action) =>
    mutationThunks.some((thunk) => action.type === thunk.fulfilled.type);

const isMutationRejected = (action) =>
    mutationThunks.some((thunk) => action.type === thunk.rejected.type);

/* -------------------------------------------------------
 * Slice
 * ----------------------------------------------------- */
const vaultAirdropSlice = createSlice({
    name: "vaultAirdrop",
    initialState,
    reducers: {
        clearVaultAirdropError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        /* ========= FETCH VAULT DETAILS ========= */
        builder
            .addCase(fetchVaultAirdropDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVaultAirdropDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload;
            })
            .addCase(fetchVaultAirdropDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            });

        /* ========= FETCH AUDIT LOGS ========= */
        builder
            .addCase(fetchAuditLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.auditLogs = action.payload;
            })
            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message;
            });

        /* ========= MUTATION MATCHERS ========= */
        builder
            .addMatcher(isMutationPending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addMatcher(isMutationFulfilled, (state) => {
                state.actionLoading = false;
            })
            .addMatcher(isMutationRejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload || action.error?.message;
            });
    },
});

/* -------------------------------------------------------
 * Exports
 * ----------------------------------------------------- */
export const { clearVaultAirdropError } = vaultAirdropSlice.actions;
export default vaultAirdropSlice.reducer;
