import { createSelector } from "@reduxjs/toolkit";

/* ------------------------------------------------
 * Base selector
 * ------------------------------------------------ */
const selectRewardCampaignState = (state) => state.rewardCampaign;

/* ------------------------------------------------
 * Primitive selectors
 * ------------------------------------------------ */
export const selectRewardCampaignList = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.list
);

export const selectRewardCampaignPagination = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.pagination
);

export const selectCurrentRewardCampaign = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.current
);

export const selectRewardCampaignLoading = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.loading
);

export const selectRewardCampaignActionLoading = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.actionLoading
);

export const selectRewardCampaignError = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.error
);

export const selectRewardCampaignSuccessMessage = createSelector(
    [selectRewardCampaignState],
    (campaign) => campaign.successMessage
);

/* ------------------------------------------------
 * Derived selectors (computed state)
 * ------------------------------------------------ */

/**
 * Danh sách campaign chưa bị xoá
 */
export const selectActiveRewardCampaigns = createSelector(
    [selectRewardCampaignList],
    (list) => list.filter((c) => !c.isDeleted)
);

/**
 * Danh sách campaign đã bị xoá
 */
export const selectDeletedRewardCampaigns = createSelector(
    [selectRewardCampaignList],
    (list) => list.filter((c) => c.isDeleted)
);

/**
 * Chỉ campaign đang active
 */
export const selectRunningRewardCampaigns = createSelector(
    [selectRewardCampaignList],
    (list) => list.filter(
        (c) => c.status === "active" && !c.isDeleted
    )
);

/**
 * Kiểm tra campaign hiện tại có thể update không
 * (dùng cho disable button Update)
 */
export const selectCanUpdateCurrentCampaign = createSelector(
    [selectCurrentRewardCampaign],
    (campaign) => {
        if (!campaign) return false;
        if (campaign.isDeleted) return false;
        if (campaign.status === "ended") return false;
        return true;
    }
);

/**
 * Kiểm tra có thể restore không
 */
export const selectCanRestoreCurrentCampaign = createSelector(
    [selectCurrentRewardCampaign],
    (campaign) => {
        if (!campaign) return false;
        return campaign.isDeleted === true;
    }
);
