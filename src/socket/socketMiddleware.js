import socket from "./socket";
import { logoutThunk } from "../stores/thunks/userThunks";
import {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    updateUserRealtime,
} from "../stores/slices/userManagementSlice";
import { setCurrentUser } from "../stores/slices/userSlice";

/**
 * ⚙️ Biến cờ để đảm bảo không gắn listener nhiều lần
 */
let socketInitialized = false;

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const { isAuthenticated, currentUser, accessToken } = store.getState().user;

    /**
     * ✅ Khi user đăng nhập và socket chưa khởi tạo → kết nối
     */
    if (isAuthenticated && currentUser && !socketInitialized) {
        socketInitialized = true;

        // Gán token vào handshake
        socket.auth = { token: accessToken };
        socket.connect();

        /** -----------------------
         *  📡 REGISTER SOCKET EVENTS
         * ----------------------- */
        socket.on("connect", () => {
            if (currentUser?._id || currentUser?.id) {
                socket.emit("user_online", currentUser._id || currentUser.id);
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("🔴 Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.warn("⚠️ Socket connection error:", err.message);
        });

        /** 🧠 Cập nhật danh sách online toàn cục */
        socket.on("online_users", (users) => {
            store.dispatch(setOnlineUsers(users));
        });

        /** 👤 Khi user khác online/offline */
        socket.on("user_online", (userId) => {
            store.dispatch(addOnlineUser(userId));
        });

        socket.on("user_offline", (userId) => {
            store.dispatch(removeOnlineUser(userId));
        });

        /** -----------------------
         *  🧩 REALTIME EVENTS
         * ----------------------- */

        // ⚙️ Khi role user thay đổi (admin cập nhật)
        socket.on("role_updated", (updatedUser) => {
            store.dispatch(updateUserRealtime(updatedUser));

            const current = store.getState().user.currentUser;
            if (current?._id === updatedUser._id && current.role !== updatedUser.role) {
                store.dispatch(setCurrentUser({ ...current, ...updatedUser }));
            }
        });

        // 🧩 Khi user profile thay đổi (vd: admin update thông tin)
        socket.on("user_profile_updated", (updatedUser) => {
            store.dispatch(updateUserRealtime(updatedUser));
        });

        /**
         * 🚫 Khi admin khóa / ban user hiện tại
         * → Client nhận event user_banned và logout ngay lập tức
         */
        socket.on("user_banned", (data) => {
            const bannedId = typeof data === "object" ? data._id : data;
            const current = store.getState().user.currentUser;

            if (current?._id === bannedId) {
                console.warn("🚫 You have been banned. Logging out immediately...");
                store.dispatch(logoutThunk());
                socket.disconnect(); // Ngắt socket để không còn nhận event
            }
        });

        // 🔔 Notification realtime (tùy chọn)
        socket.on("new_notification", (data) => {
            console.log("🔔 New notification:", data);
            // store.dispatch(addNotification(data));
        });

        /** -----------------------
         *  🧹 CLEANUP HANDLER
         * ----------------------- */
        const cleanupSocket = () => {
            [
                "connect",
                "disconnect",
                "connect_error",
                "online_users",
                "user_online",
                "user_offline",
                "role_updated",
                "user_profile_updated",
                "user_banned",
                "new_notification",
            ].forEach((event) => socket.off(event));
        };

        // Cleanup khi reload tab
        window.addEventListener("beforeunload", () => {
            cleanupSocket();
            if (currentUser?._id) socket.emit("user_offline", currentUser._id);
            socket.disconnect();
        });
    }

    /**
     * ❌ Khi logout → ngắt kết nối và reset
     */
    if (!isAuthenticated && socketInitialized) {
        console.log("🔌 Disconnecting socket (logout)...");
        if (currentUser?._id) socket.emit("user_offline", currentUser._id);
        socket.disconnect();
        socketInitialized = false;
        store.dispatch(setOnlineUsers([]));
    }

    return result;
};

/** ✅ Helper: emit event từ mọi nơi */
export const emitSocketEvent = (event, payload) => {
    if (socket.connected) {
        socket.emit(event, payload);
    } else {
        console.warn("⚠️ Socket not connected → cannot emit:", event);
    }
};

export default socketMiddleware;
