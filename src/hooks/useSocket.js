// src/hooks/useSocket.js
import { useEffect } from "react";
import socket from "../socket/socket";

/**
 * Custom hook để khởi tạo và giám sát kết nối socket ở cấp component.
 * 👉 Không quản lý event logic (đã do socketMiddleware làm).
 */
export default function useSocket(userId) {
    useEffect(() => {
        if (!userId) return;

        console.log("👤 useSocket mounted for user:", userId);

        // Nếu socket chưa kết nối, đảm bảo kết nối
        if (!socket.connected) {
            socket.connect();
        }

        const handleConnect = () => {
            console.log("🟢 Socket connected:", socket.id);
            socket.emit("user_online", userId);
        };

        const handleDisconnect = (reason) => {
            console.log("🔴 Socket disconnected:", reason);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        return () => {
            console.log("🧹 Cleaning up socket listeners...");
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
        };
    }, [userId]);

    return socket;
}
