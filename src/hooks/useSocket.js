import { useEffect } from "react";
import socket from "../socket/socket";

/**
 * Hook tối giản — chỉ để đảm bảo socket tồn tại & cleanup đúng.
 * 👉 Không connect / emit ở đây nữa (middleware đã xử lý).
 */
export default function useSocket() {
    useEffect(() => {
        // console.log("🔌 useSocket mounted");

        const handleConnect = () => {
            // console.log("🟢 Socket connected:", socket.id);
        };

        const handleDisconnect = (reason) => {
            console.log("🔴 Socket disconnected:", reason);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        return () => {
            console.log("🧹 Cleaning up useSocket listeners...");
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
        };
    }, []);

    return socket;
}
