// src/services/vaultMasterService.js
import axiosInstance from "../axiosInstance";

const API_URL = "/vaultmaster"; // chỉnh theo env nếu cần

const vaultMasterService = {
    // 🔐 Mint coin từ master vault
    mintCoin: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}/mint`, payload);
        return response.data; // { success, message, data }
    },

    // 🔥 Burn coin từ vault con
    burnCoin: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}/burn`, payload);
        return response.data; // { success, message, data }
    },

    // 🪙 Burn coin trong master vault
    burnMaster: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}/master/burn`, payload);
        return response.data; // { success, message, data }
    },

    // 💰 Mint coin vào master vault
    mintMaster: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}/master/mint`, payload);
        return response.data; // { success, message, data }
    },

    // 🔄 Transfer coin giữa các vault
    transferBetweenVaults: async (payload) => {
        const response = await axiosInstance.post(`${API_URL}/transfer`, payload);
        return response.data; // { success, message, data }
    },

    // 📊 Lấy thông tin số dư tất cả vaults
    getAllVaultBalances: async () => {
        const response = await axiosInstance.get(`${API_URL}/balances`);
        return response.data; // { success, data: [ { vaultId, balance, ... } ] }
    },

    // 🔍 Lấy thông tin chi tiết các vault con
    getAllVaultDetails: async () => {
        const response = await axiosInstance.get(`${API_URL}/details`);
        return response.data; // { success, data: [ { vaultId, balance, history, ... } ] }
    },

    // 🔒 Khóa vault theo type (master hoặc child)
    lockVault: async (type) => {
        const response = await axiosInstance.post(`${API_URL}/lock/${type}`);
        return response.data; // { success, message }
    },

    // 🔓 Mở khóa vault theo type
    unlockVault: async (type) => {
        const response = await axiosInstance.post(`${API_URL}/unlock/${type}`);
        return response.data; // { success, message }
    },
};

export default vaultMasterService;
