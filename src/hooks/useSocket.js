// src/hooks/useSocket.js
import { useEffect } from "react";
import socket from "../socket/socket";

export default function useSocket(userId) {
    useEffect(() => {
        if (!userId) return;

        console.log("👤 useSocket mounted for user:", userId);

        socket.on("online_users", (list) => {
            console.log("👥 Online users:", list);
        });

        socket.on("role_updated", ({ newRole }) => {
            console.log("⚙️ Your role changed to:", newRole);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        return () => {
            console.log("🧹 Cleaning up socket listeners...");
            socket.off("online_users");
            socket.off("role_updated");
            socket.off("disconnect");
        };
    }, [userId]);

    return socket;
}
