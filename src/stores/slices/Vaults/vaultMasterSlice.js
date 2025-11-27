// src/features/vaults/vaultMasterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    mintCoin,
    burnCoin,
    burnMaster,
    mintMaster,
    transferBetweenVaults,

    getAllVaultBalances,
    getAllVaultDetails,
    lockVault,
    unlockVault,
} from "../../thunks/Vaults/vaultMasterThunks.js";

const initialState = {
    balances: [],
    locks: {},
    details: [],
    loading: false,
    error: null,
    successMessage: null,
};

const vaultMasterSlice = createSlice({
    name: "vaultMaster",
    initialState,
    reducers: {
        clearVaultError: (state) => {
            state.error = null;
        },
        clearVaultSuccess: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        // ------------------- MINT / BURN -------------------
        builder
            .addCase(mintCoin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mintCoin.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(mintCoin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(burnCoin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(burnCoin.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(burnCoin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(burnMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(burnMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(burnMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(mintMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mintMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(mintMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ------------------- TRANSFER -------------------
        builder
            .addCase(transferBetweenVaults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(transferBetweenVaults.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(transferBetweenVaults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ------------------- GET INFO -------------------
        builder
            // --- Lấy số dư ---
            .addCase(getAllVaultBalances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllVaultBalances.fulfilled, (state, action) => {
                state.loading = false;

                const { balances, locks } = action.payload || {};

                state.balances = balances || {};
                state.locks = locks || {};
            })
            .addCase(getAllVaultBalances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "Lỗi tải dữ liệu Vault.";
            })



            .addCase(getAllVaultDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllVaultDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.details = action.payload.data;
            })
            .addCase(getAllVaultDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ------------------- LOCK / UNLOCK -------------------
        builder
            .addCase(lockVault.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(lockVault.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(lockVault.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(unlockVault.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unlockVault.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(unlockVault.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearVaultError, clearVaultSuccess } = vaultMasterSlice.actions;
export default vaultMasterSlice.reducer;
