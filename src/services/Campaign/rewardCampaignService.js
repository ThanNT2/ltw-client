// src/services/rewardCampaignService.js
import axiosInstance from "../axiosInstance";

const API_URL = "/rewardcampaign"; // base path theo backend

const VALID_STATUS_ACTIONS = ["activate", "pause", "resume", "inactivate", "end"];

const assertId = (id) => {
    if (!id || typeof id !== "string") {
        throw new Error("campaignId is required");
    }
};

const rewardCampaignService = {
    /* ------------------------------------------------
     * 📌 POST /
     * Create campaign
     * ------------------------------------------------ */
    create: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}`, payload);
        return response.data;
    },

    /* ------------------------------------------------
     * 📌 GET /admin
     * Admin list campaigns
     * ------------------------------------------------ */
    getList: async (params) => {
        const response = await axiosInstance.get(`${API_URL}/admin`, { params });
        return response.data;
    },

    /* ------------------------------------------------
     * 📌 GET /public
     * Public list campaigns
     * ------------------------------------------------ */
    getPublicList: async (params) => {
        const response = await axiosInstance.get(`${API_URL}/public`, { params });
        return response.data;
    },

    /* ------------------------------------------------
     * 📌 GET /:id
     * Get campaign detail by ID
     * ------------------------------------------------ */
    getById: async (id) => {
        assertId(id);
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    /* ------------------------------------------------
     * 📌 PATCH /:id
     * Update campaign
     * ------------------------------------------------ */
    update: async (id, payload) => {
        assertId(id);
        const response = await axiosInstance.patch(`${API_URL}/${id}`, payload);
        return response.data;
    },

    /* ------------------------------------------------
     * 📌 DELETE /:id
     * Soft delete campaign
     * ------------------------------------------------ */
    delete: async (id) => {
        assertId(id);
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        return response.data;
    },

    /* ------------------------------------------------
     * 📌 PATCH /:id/restore
     * Restore campaign
     * ------------------------------------------------ */
    restore: async (id) => {
        assertId(id);
        const response = await axiosInstance.patch(`${API_URL}/${id}/restore`);
        return response.data;
    },

    /* =====================================================
     * LIFECYCLE CONTROL
     * PATCH /:id/status/:action
     * ===================================================== */
    setStatus: async (id, action) => {
        assertId(id);

        if (!VALID_STATUS_ACTIONS.includes(action)) {
            throw new Error(`Invalid campaign status action: ${action}`);
        }

        const response = await axiosInstance.patch(
            `${API_URL}/${id}/status/${action}`
        );

        return response.data;
    },

    activate: (id) => rewardCampaignService.setStatus(id, "activate"),
    pause: (id) => rewardCampaignService.setStatus(id, "pause"),
    resume: (id) => rewardCampaignService.setStatus(id, "resume"),
    inactivate: (id) => rewardCampaignService.setStatus(id, "inactivate"),
    end: (id) => rewardCampaignService.setStatus(id, "end"),

    /* =====================================================
     * BUDGET
     * POST /:id/allocate
     * ===================================================== */
    allocateBudget: async (id) => {

        assertId(id);
        const response = await axiosInstance.post(`${API_URL}/${id}/allocate`);
        return response.data;
    },
};

export default rewardCampaignService;
