import { createSlice } from "@reduxjs/toolkit";
import {
    fetchRewardCampaignList,
    fetchRewardCampaignPublicList, // ✅ NEW
    fetchRewardCampaignById,
    createRewardCampaign,
    updateRewardCampaign,
    deleteRewardCampaign,
    restoreRewardCampaign,

    // ✅ NEW thunks (lifecycle + allocate)
    activateRewardCampaign,
    pauseRewardCampaign,
    resumeRewardCampaign,
    inactivateRewardCampaign,
    endRewardCampaign,
    allocateRewardCampaignBudget,
} from "../../thunks/Campaign/rewardCampaignThunk";

const initialState = {
    list: [],
    pagination: null,

    current: null,

    loading: false,
    actionLoading: false,

    error: null,
    successMessage: null,
};

const rewardCampaignSlice = createSlice({
    name: "rewardCampaign",
    initialState,
    reducers: {
        clearRewardCampaignError(state) {
            state.error = null;
        },
        clearRewardCampaignSuccess(state) {
            state.successMessage = null;
        },
        clearCurrentCampaign(state) {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        /* ------------------------------------------------
         * 📌 FETCH LIST (ADMIN)
         * ------------------------------------------------ */
        builder
            .addCase(fetchRewardCampaignList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewardCampaignList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.items || [];
                state.pagination = {
                    total: action.payload.total,
                    page: action.payload.page,
                    limit: action.payload.limit,
                    pages: action.payload.pages,
                };
            })
            .addCase(fetchRewardCampaignList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* ------------------------------------------------
         * 📌 FETCH LIST (PUBLIC) ✅ NEW
         * ⚠️ vẫn map vào state.list để không phá UI hiện tại
         * ------------------------------------------------ */
        builder
            .addCase(fetchRewardCampaignPublicList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewardCampaignPublicList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.items || [];
                state.pagination = {
                    total: action.payload.total,
                    page: action.payload.page,
                    limit: action.payload.limit,
                    pages: action.payload.pages,
                };
            })
            .addCase(fetchRewardCampaignPublicList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* ------------------------------------------------
         * 📌 FETCH BY ID
         * ------------------------------------------------ */
        builder
            .addCase(fetchRewardCampaignById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewardCampaignById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(fetchRewardCampaignById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* ------------------------------------------------
         * 📌 CREATE
         * ------------------------------------------------ */
        builder
            .addCase(createRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign created successfully";
                state.list.unshift(action.payload);
            })
            .addCase(createRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ------------------------------------------------
         * 📌 UPDATE
         * ------------------------------------------------ */
        builder
            .addCase(updateRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign updated successfully";

                const index = state.list.findIndex((c) => c._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }

                if (state.current?._id === action.payload._id) {
                    state.current = action.payload;
                }
            })
            .addCase(updateRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ------------------------------------------------
         * 📌 DELETE
         * ------------------------------------------------ */
        builder
            .addCase(deleteRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign deleted";

                state.list = state.list.filter((c) => c._id !== action.payload.id);

                if (state.current?._id === action.payload.id) {
                    state.current = null;
                }
            })
            .addCase(deleteRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ------------------------------------------------
         * 📌 RESTORE
         * ------------------------------------------------ */
        builder
            .addCase(restoreRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(restoreRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign restored successfully";

                const index = state.list.findIndex((c) => c._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                } else {
                    state.list.unshift(action.payload);
                }

                if (state.current?._id === action.payload._id) {
                    state.current = action.payload;
                }
            })
            .addCase(restoreRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ============================================================
         * ✅ LIFECYCLE CONTROL THUNKS (activate/pause/resume/...)
         * ============================================================ */

        const applyCampaignUpdate = (state, campaign) => {
            if (!campaign?._id) return;

            const index = state.list.findIndex((c) => c._id === campaign._id);
            if (index !== -1) state.list[index] = campaign;

            if (state.current?._id === campaign._id) {
                state.current = campaign;
            }
        };

        /* ✅ ACTIVATE */
        builder
            .addCase(activateRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(activateRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign activated";
                applyCampaignUpdate(state, action.payload);
            })
            .addCase(activateRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ✅ PAUSE */
        builder
            .addCase(pauseRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(pauseRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign paused";
                applyCampaignUpdate(state, action.payload);
            })
            .addCase(pauseRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ✅ RESUME */
        builder
            .addCase(resumeRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resumeRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign resumed";
                applyCampaignUpdate(state, action.payload);
            })
            .addCase(resumeRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ✅ INACTIVATE */
        builder
            .addCase(inactivateRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(inactivateRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign inactivated";
                applyCampaignUpdate(state, action.payload);
            })
            .addCase(inactivateRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ✅ END */
        builder
            .addCase(endRewardCampaign.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(endRewardCampaign.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Campaign ended";
                applyCampaignUpdate(state, action.payload);
            })
            .addCase(endRewardCampaign.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });

        /* ============================================================
         * ✅ ALLOCATE BUDGET THUNK
         * ============================================================ */
        builder
            .addCase(allocateRewardCampaignBudget.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(allocateRewardCampaignBudget.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.successMessage = "Budget allocated successfully";
                applyCampaignUpdate(state, action.payload);
            })
            .addCase(allocateRewardCampaignBudget.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearRewardCampaignError,
    clearRewardCampaignSuccess,
    clearCurrentCampaign,
} = rewardCampaignSlice.actions;

export default rewardCampaignSlice.reducer;
