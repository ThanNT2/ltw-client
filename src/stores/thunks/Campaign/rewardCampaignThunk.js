import { createAsyncThunk } from "@reduxjs/toolkit";
import rewardCampaignService from "../../../services/Campaign/rewardCampaignService";

/* ------------------------------------------------
 * 📌 Fetch campaign list
 * ------------------------------------------------ */
export const fetchRewardCampaignList = createAsyncThunk(
    "rewardCampaign/fetchList",
    async (params, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.getList(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch campaigns"
            );
        }
    }
);
/* ------------------------------------------------
 * 🌍 Fetch public campaign list (User)
 * GET /rewardcampaign/public
 * ------------------------------------------------ */
export const fetchRewardCampaignPublicList = createAsyncThunk(
    "rewardCampaign/fetchPublicList",
    async (params, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.getPublicList(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch public campaigns"
            );
        }
    }
);


/* ------------------------------------------------
 * 📌 Fetch campaign by ID
 * ------------------------------------------------ */
export const fetchRewardCampaignById = createAsyncThunk(
    "rewardCampaign/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.getById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch campaign"
            );
        }
    }
);

/* ------------------------------------------------
 * 📌 Create campaign
 * ------------------------------------------------ */
export const createRewardCampaign = createAsyncThunk(
    "rewardCampaign/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.create(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Create campaign failed"
            );
        }
    }
);

/* ------------------------------------------------
 * 📌 Update campaign
 * ------------------------------------------------ */
export const updateRewardCampaign = createAsyncThunk(
    "rewardCampaign/update",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.update(id, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Update campaign failed"
            );
        }
    }
);

/* ------------------------------------------------
 * 📌 Soft delete campaign
 * ------------------------------------------------ */
export const deleteRewardCampaign = createAsyncThunk(
    "rewardCampaign/delete",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.delete(id);
            return { id, message: res.message };
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Delete campaign failed"
            );
        }
    }
);

/* ------------------------------------------------
 * 📌 Restore campaign
 * ------------------------------------------------ */
export const restoreRewardCampaign = createAsyncThunk(
    "rewardCampaign/restore",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.restore(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Restore campaign failed"
            );
        }
    }
);

/* =====================================================
 * ✅ LIFECYCLE CONTROL (Status actions)
 * Backend: PATCH /rewardcampaign/:id/status/<action>
 * ===================================================== */

/** ✅ Activate */
export const activateRewardCampaign = createAsyncThunk(
    "rewardCampaign/activate",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.activate(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Activate campaign failed"
            );
        }
    }
);

/** ✅ Pause */
export const pauseRewardCampaign = createAsyncThunk(
    "rewardCampaign/pause",
    async (id, { rejectWithValue }) => {
        console.log("pause campaign =", id)
        try {

            const res = await rewardCampaignService.pause(id);
            console.log("try =", res)
            return res.data;
        } catch (err) {
            console.log("catch =", err)
            return rejectWithValue(
                err.response?.data?.message || "Pause campaign failed"
            );
        }
    }
);

/** ✅ Resume */
export const resumeRewardCampaign = createAsyncThunk(
    "rewardCampaign/resume",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.resume(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Resume campaign failed"
            );
        }
    }
);

/** ✅ Inactivate */
export const inactivateRewardCampaign = createAsyncThunk(
    "rewardCampaign/inactivate",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.inactivate(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Inactivate campaign failed"
            );
        }
    }
);

/** ✅ End */
export const endRewardCampaign = createAsyncThunk(
    "rewardCampaign/end",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.end(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "End campaign failed"
            );
        }
    }
);

/* =====================================================
 * ✅ BUDGET
 * Backend: POST /rewardcampaign/:id/allocate
 * ===================================================== */
export const allocateRewardCampaignBudget = createAsyncThunk(
    "rewardCampaign/allocateBudget",
    async (id, { rejectWithValue }) => {
        try {
            const res = await rewardCampaignService.allocateBudget(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Allocate budget failed"
            );
        }
    }
);
