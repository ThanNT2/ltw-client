// src/socket/socketMiddleware.js
import socket from "./socket";
import {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
} from "../stores/slices/userManagementSlice";
import { updateUserRealtime } from "../stores/slices/userSlice";

// ⚙️ Dùng flag để tránh listener trùng
let socketInitialized = false;

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const { isAuthenticated, currentUser } = store.getState().user;

    // ✅ Khi user login → connect socket (chỉ 1 lần)
    if (isAuthenticated && currentUser && !socketInitialized) {
        socketInitialized = true;
        socket.connect();

        // Gửi token kèm theo để server xác thực
        socket.auth = { token: currentUser?.accessToken };

        socket.on("connect", () => {
            console.log("🟢 Socket connected:", socket.id);
            if (currentUser?.id) {
                socket.emit("user_online", currentUser.id);
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("🔴 Socket disconnected:", reason);
        });

        // 🧠 Danh sách user online → update Redux
        socket.on("online_users", (users) => {
            console.log("👥 Online users (server broadcast):", users);
            store.dispatch(setOnlineUsers(users));
        });

        // 👤 Khi user khác online → thêm vào danh sách
        socket.on("user_online", (userId) => {
            console.log("✅ user_online:", userId);
            store.dispatch(addOnlineUser(userId));
        });

        // 🚪 Khi user khác offline → xóa khỏi danh sách
        socket.on("user_offline", (userId) => {
            console.log("🚪 user_offline:", userId);
            store.dispatch(removeOnlineUser(userId));
        });

        // ⚡ Khi role/profile cập nhật realtime
        socket.on("role_updated", (data) => {
            console.log("⚡ role_updated:", data);
            store.dispatch(updateUserRealtime(data));
        });

        socket.on("user_profile_updated", (data) => {
            console.log("⚡ user_profile_updated:", data);
            store.dispatch(updateUserRealtime(data));
        });
    }

    // ❌ Khi logout → ngắt kết nối, reset cờ
    if (!isAuthenticated && socketInitialized) {
        console.log("🔌 Disconnecting socket (user logged out)...");
        if (currentUser?.id) socket.emit("user_offline", currentUser.id);
        socket.disconnect();
        socketInitialized = false;
        store.dispatch(setOnlineUsers([])); // ✅ reset list khi logout
    }

    return result;
};

// ✅ Hàm emit tiện ích
export const emitSocketEvent = (event, payload) => {
    if (socket.connected) {
        socket.emit(event, payload);
    } else {
        console.warn("⚠️ Socket chưa kết nối, không thể emit:", event);
    }
};

export default socketMiddleware;
