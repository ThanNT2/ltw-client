// src/services/vaultAirdropService.js
import axiosInstance from "../axiosInstance";

const API_URL = "/vaultairdrop"; // base path theo backend

const vaultAirdropService = {

    /* ------------------------------------------------
     * 📌 GET /api/v1/vaults/airdrop
     * Lấy chi tiết vault airdrop (campaigns, stats)
     * ------------------------------------------------ */
    getDetails: async () => {
        const response = await axiosInstance.get(`${API_URL}`);
        return response.data; // { success, data }
    },

    /* ------------------------------------------------
     * 📌 PATCH /allocate-budget
     * Cấp ngân sách ban đầu cho campaign
     * payload: { campaignId, amount }
     * ------------------------------------------------ */
    allocateBudget: async (payload) => {
        const response = await axiosInstance.patch(
            `${API_URL}/allocate-budget`,
            payload
        );
        return response.data; // { success, message, data }
    },

    /* ------------------------------------------------
     * 📌 PATCH /add-budget
     * Thêm ngân sách cho campaign
     * payload: { campaignId, amount }
     * ------------------------------------------------ */
    addBudget: async (payload) => {
        const response = await axiosInstance.patch(
            `${API_URL}/add-budget`,
            payload
        );
        return response.data; // { success, message, data }
    },

    /* ------------------------------------------------
     * 📌 PATCH /distribute
     * Phân phối reward cho user
     * payload: { campaignId, userId, amount }
     * ------------------------------------------------ */
    distributeReward: async (payload) => {
        const response = await axiosInstance.patch(
            `${API_URL}/distribute`,
            payload
        );
        return response.data; // { success, message, data }
    },

    /* ------------------------------------------------
     * 📌 PATCH /reset-checkin
     * Reset daily checkin của campaign
     * payload: { campaignId }
     * ------------------------------------------------ */
    resetDailyCheckin: async (payload) => {
        const response = await axiosInstance.patch(
            `${API_URL}/reset-checkin`,
            payload
        );
        return response.data; // { success, message }
    },

    /* ------------------------------------------------
     * 📌 GET /audit-logs
     * Lấy audit log của vault
     * params: { campaignId, userId, fromDate, toDate }
     * ------------------------------------------------ */
    getAuditLogs: async (params) => {
        const response = await axiosInstance.get(
            `${API_URL}/audit-logs`,
            { params }
        );
        return response.data; // { success, data, pagination? }
    },
};

export default vaultAirdropService;
