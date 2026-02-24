// src/features/vaults/vaultMasterThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import vaultMasterService from "../../../services/Vaults/vaultMasterService.js";

// ------------------- MINT / BURN -------------------

// Mint coin từ master vault
export const mintCoin = createAsyncThunk(
    "vaults/mintCoin",
    async (payload, { rejectWithValue }) => {
        try {
            return await vaultMasterService.mintCoin(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Burn coin từ vault con
export const burnCoin = createAsyncThunk(
    "vaults/burnCoin",
    async (payload, { rejectWithValue }) => {
        try {
            return await vaultMasterService.burnCoin(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Burn coin trong master vault
export const burnMaster = createAsyncThunk(
    "vaults/burnMaster",
    async (payload, { rejectWithValue }) => {
        try {
            return await vaultMasterService.burnMaster(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Mint coin vào master vault
export const mintMaster = createAsyncThunk(
    "vaults/mintMaster",
    async (payload, { rejectWithValue }) => {
        try {
            return await vaultMasterService.mintMaster(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ------------------- TRANSFER -------------------

// Transfer coin giữa các vault
export const transferBetweenVaults = createAsyncThunk(
    "vaults/transfer",
    async (payload, { rejectWithValue }) => {
        try {
            return await vaultMasterService.transferBetweenVaults(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ------------------- GET INFO -------------------

// Lấy thông tin số dư tất cả vaults
export const getAllVaultBalances = createAsyncThunk(
    "vaults/getAllVaultBalances",
    async (_, { rejectWithValue }) => {
        try {
            const response = await vaultMasterService.getAllVaultBalances();
            console.log("response =", response)

            // Đảm bảo chỉ lấy đúng data cần thiết
            return {
                balances: response.data.balances || {},
                locks: response.data.locks || {}
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Lấy thông tin chi tiết các vault con
export const getAllVaultDetails = createAsyncThunk(
    "vaults/getAllVaultDetails",
    async (_, { rejectWithValue }) => {
        try {
            return await vaultMasterService.getAllVaultDetails();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ------------------- LOCK / UNLOCK -------------------

// Khóa vault
export const lockVault = createAsyncThunk(
    "vaults/lockVault",
    async (type, { rejectWithValue }) => {
        try {
            return await vaultMasterService.lockVault(type);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Mở khóa vault
export const unlockVault = createAsyncThunk(
    "vaults/unlockVault",
    async (type, { rejectWithValue }) => {
        try {
            return await vaultMasterService.unlockVault(type);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
