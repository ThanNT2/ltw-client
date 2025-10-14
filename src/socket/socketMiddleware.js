// src/socket/socketMiddleware.js
import socket from "./socket";
import {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
} from "../stores/slices/userManagementSlice";
import { updateUserRealtime, setCurrentUser } from "../stores/slices/userSlice";

/**
 * ⚙️ State global để ngăn listener trùng lặp
 */
let socketInitialized = false;

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const { isAuthenticated, currentUser, accessToken } = store.getState().user;

    /**
     * ✅ Khi user đăng nhập và socket chưa init → kết nối socket
     */
    if (isAuthenticated && currentUser && !socketInitialized) {
        socketInitialized = true;

        // Gán token vào handshake auth
        socket.auth = { token: accessToken };
        socket.connect();

        console.log("⚡ Socket initialized for user:", currentUser._id || currentUser.id);

        /**
         * ----------------------
         *   📡 SOCKET EVENTS
         * ----------------------
         */
        socket.on("connect", () => {
            console.log("🟢 Socket connected:", socket.id);
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

        // 🧠 Danh sách online toàn cục
        socket.on("online_users", (users) => {
            console.log("👥 Online users broadcast:", users);
            store.dispatch(setOnlineUsers(users));
        });

        // 👤 User khác online/offline
        socket.on("user_online", (userId) => {
            store.dispatch(addOnlineUser(userId));
        });
        socket.on("user_offline", (userId) => {
            store.dispatch(removeOnlineUser(userId));
        });

        /**
         * ----------------------
         *   🧩 REALTIME EVENTS
         * ----------------------
         */

        // ⚙️ Khi role user thay đổi (admin cập nhật)
        socket.on("role_updated", (updatedUser) => {
            console.log("⚡ role_updated:", updatedUser);
            store.dispatch(updateUserRealtime(updatedUser));

            // Nếu user hiện tại bị hạ quyền hoặc thay đổi role
            const current = store.getState().user.currentUser;
            if (current?._id === updatedUser._id && current.role !== updatedUser.role) {
                console.log(`🔄 Your role changed from ${current.role} → ${updatedUser.role}`);
                store.dispatch(setCurrentUser(updatedUser));
            }
        });

        // 📁 Khi user cập nhật profile
        socket.on("user_profile_updated", (updatedUser) => {
            console.log("🧩 user_profile_updated:", updatedUser);
            store.dispatch(updateUserRealtime(updatedUser));
        });

        // 🚫 Khi admin khóa hoặc xóa user
        socket.on("user_banned", (userId) => {
            const current = store.getState().user.currentUser;
            if (current?._id === userId) {
                console.warn("🚫 You have been banned. Logging out...");
                store.dispatch({ type: "user/logoutThunk/fulfilled" });
            }
        });

        // 🔔 Khi có notification realtime
        socket.on("new_notification", (data) => {
            console.log("🔔 New notification:", data);
            // Có thể dispatch đến notificationSlice
            // store.dispatch(addNotification(data));
        });

        /**
         * ----------------------
         *   🧹 CLEANUP HANDLER
         * ----------------------
         */
        const cleanupSocket = () => {
            console.log("🧹 Cleaning up socket listeners...");
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

        // Đảm bảo cleanup khi window unload
        window.addEventListener("beforeunload", () => {
            cleanupSocket();
            socket.disconnect();
        });
    }

    /**
     * ❌ Khi logout → ngắt kết nối
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

/**
 * ✅ Hàm emit tiện ích (gọi từ bất kỳ đâu)
 */
export const emitSocketEvent = (event, payload) => {
    if (socket.connected) {
        socket.emit(event, payload);
    } else {
        console.warn("⚠️ Socket not connected → cannot emit:", event);
    }
};

export default socketMiddleware;
