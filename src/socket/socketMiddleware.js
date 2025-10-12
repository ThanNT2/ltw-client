// src/socket/socketMiddleware.js
import socket from "./socket";
import {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
} from "../stores/slices/userManagementSlice";
import { updateUserRealtime } from "../stores/slices/userSlice";

// Dùng cờ để tránh đăng ký lại listener nhiều lần
let socketInitialized = false;

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const { isAuthenticated, currentUser } = store.getState().user;

    // ✅ Khi user đăng nhập → chỉ kết nối 1 lần duy nhất
    if (isAuthenticated && currentUser && !socketInitialized) {
        socketInitialized = true;
        socket.connect();

        socket.on("connect", () => {
            console.log("🟢 Socket connected:", socket.id);
            socket.emit("user_online", currentUser.id);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected");
        });

        // 🧠 Cập nhật danh sách user online (cho admin/dashboard)
        socket.on("online_users", (users) => {
            console.log("👥 Online users list dkm:", users);
            store.dispatch(setOnlineUsers(users));
        });

        // 👤 Khi có user mới online
        socket.on("user_online", (userId) => {
            store.dispatch(addOnlineUser(userId));
        });

        // 🚪 Khi user offline
        socket.on("user_offline", (userId) => {
            store.dispatch(removeOnlineUser(userId));
        });

        // 🪄 Khi role/profile thay đổi realtime
        socket.on("role_updated", (data) => {
            console.log("⚡ role_updated:", data);
            store.dispatch(updateUserRealtime(data));
        });

        socket.on("user_profile_updated", (data) => {
            console.log("⚡ user_profile_updated:", data);
            store.dispatch(updateUserRealtime(data));
        });
    }

    // ❌ Khi logout → ngắt kết nối và reset flag
    if (!isAuthenticated && socketInitialized) {
        console.log("🔌 Disconnecting socket (user logged out)...");
        socket.emit("user_offline", currentUser?.id);
        socket.disconnect();
        socketInitialized = false;
    }

    return result;
};

// ✅ Hàm emit tiện ích (dùng trong component / thunk)
export const emitSocketEvent = (event, payload) => {
    if (socket.connected) {
        socket.emit(event, payload);
    } else {
        console.warn("⚠️ Socket chưa kết nối, không thể emit:", event);
    }
};

export default socketMiddleware;
