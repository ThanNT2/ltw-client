import { useEffect } from "react";
import socket from "../socket/socket";

export default function useSocket(userId) {
    useEffect(() => {
        if (!userId) return;

        // Kết nối tới server
        socket.connect();

        // Khi đã connect
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("user_online", userId);
        });

        // Lắng nghe danh sách user online
        socket.on("online_users", (list) => {
            console.log("👥 Online users:", list);
        });

        // Khi role user bị admin đổi
        socket.on("role_updated", ({ newRole }) => {
            console.log("⚙️ Your role changed to:", newRole);
            // Bạn có thể dispatch Redux ở đây để cập nhật UI
        });

        // Khi disconnect
        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        // Cleanup khi component unmount
        return () => {
            socket.emit("user_offline", userId);
            socket.disconnect();
        };
    }, [userId]);

    return socket;
}
