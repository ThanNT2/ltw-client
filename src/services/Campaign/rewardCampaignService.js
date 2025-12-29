// src/services/rewardCampaignService.js
import axiosInstance from "../axiosInstance";

const API_URL = "/rewardcampaign"; // base path theo backend

const rewardCampaignService = {

    /* ------------------------------------------------
     * 📌 POST /
     * Tạo campaign mới
     * payload: createCampaignSchema
     * ------------------------------------------------ */
    create: async (payload) => {
        const response = await axiosInstance.post(
            `${API_URL}`,
            payload
        );
        return response.data; // { success, message, data }
    },

    /* ------------------------------------------------
     * 📌 GET /
     * Lấy danh sách campaign (pagination + filter)
     * params: listCampaignSchema
     * ------------------------------------------------ */
    getList: async (params) => {
        const response = await axiosInstance.get(
            `${API_URL}`,
            { params }
        );
        return response.data; // { success, data, pagination }
    },

    /* ------------------------------------------------
     * 📌 GET /:id
     * Lấy chi tiết campaign theo ID
     * ------------------------------------------------ */
    getById: async (id) => {
        const response = await axiosInstance.get(
            `${API_URL}/${id}`
        );
        return response.data; // { success, data }
    },

    /* ------------------------------------------------
     * 📌 PATCH /:id
     * Update campaign
     * payload: updateCampaignSchema
     * ------------------------------------------------ */
    update: async (id, payload) => {
        const response = await axiosInstance.patch(
            `${API_URL}/${id}`,
            payload
        );
        return response.data; // { success, message, data }
    },

    /* ------------------------------------------------
     * 📌 DELETE /:id
     * Soft delete campaign
     * ------------------------------------------------ */
    delete: async (id) => {
        const response = await axiosInstance.delete(
            `${API_URL}/${id}`
        );
        return response.data; // { success, message }
    },

    /* ------------------------------------------------
     * 📌 PATCH /:id/restore
     * Restore campaign đã soft delete
     * ------------------------------------------------ */
    restore: async (id) => {
        const response = await axiosInstance.patch(
            `${API_URL}/${id}/restore`
        );
        return response.data; // { success, message, data }
    },
};

export default rewardCampaignService;
