// src/store/vaultAirdrop/vaultAirdropThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import vaultAirdropService from "../../../services/Vaults/vaultAirdropService";

/* 📌 GET vault details */
export const fetchVaultAirdropDetails = createAsyncThunk(
    "vaultAirdrop/fetchDetails",
    async (_, { rejectWithValue }) => {
        try {
            const res = await vaultAirdropService.getDetails();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* 📌 Allocate budget */
export const allocateBudget = createAsyncThunk(
    "vaultAirdrop/allocateBudget",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await vaultAirdropService.allocateBudget(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* 📌 Add budget */
export const addBudget = createAsyncThunk(
    "vaultAirdrop/addBudget",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await vaultAirdropService.addBudget(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* 📌 Distribute reward */
export const distributeReward = createAsyncThunk(
    "vaultAirdrop/distributeReward",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await vaultAirdropService.distributeReward(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* 📌 Reset daily checkin */
export const resetDailyCheckin = createAsyncThunk(
    "vaultAirdrop/resetDailyCheckin",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await vaultAirdropService.resetDailyCheckin(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* 📌 Audit logs */
export const fetchAuditLogs = createAsyncThunk(
    "vaultAirdrop/fetchAuditLogs",
    async (params, { rejectWithValue }) => {
        try {
            const res = await vaultAirdropService.getAuditLogs(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
