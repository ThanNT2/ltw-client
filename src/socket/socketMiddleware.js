// src/socket/socketMiddleware.js
import { io } from "socket.io-client";
import {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    updateUserRealtime,
} from "../stores/slices/userSlice";

let socket = null;

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    const { isAuthenticated, currentUser } = state.user;

    // ✅ Khi user đăng nhập → kết nối socket
    if (isAuthenticated && currentUser && !socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:9000", {
            transports: ["websocket"],
            reconnection: true,
        });

        socket.on("connect", () => {
            console.log("🟢 Socket connected:", socket.id);
            socket.emit("user_online", currentUser._id);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected");
        });

        // 🧠 Danh sách người online
        socket.on("online_users", (users) => {
            console.log("👥 Online users:", users);
            store.dispatch(setOnlineUsers(users));
        });

        // 👤 User nào đó vừa online
        socket.on("user_online", (userId) => {
            store.dispatch(addOnlineUser(userId));
        });

        // 🚪 User nào đó vừa offline
        socket.on("user_offline", (userId) => {
            store.dispatch(removeOnlineUser(userId));
        });

        // 🪄 Cập nhật role/user profile realtime
        socket.on("role_updated", (data) => {
            console.log("⚡ role_updated:", data);
            store.dispatch(updateUserRealtime(data));
        });

        socket.on("user_profile_updated", (data) => {
            console.log("⚡ user_profile_updated:", data);
            store.dispatch(updateUserRealtime(data));
        });
    }

    // ❌ Khi user logout → ngắt kết nối socket
    if (!isAuthenticated && socket) {
        console.log("🔌 Disconnecting socket (user logged out)...");
        socket.disconnect();
        socket = null;
    }

    return result;
};

// ✅ Hàm emit ra ngoài (để dùng trong các component hay thunk)
export const emitSocketEvent = (event, payload) => {
    if (socket && socket.connected) {
        socket.emit(event, payload);
    }
};
