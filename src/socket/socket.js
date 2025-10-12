// src/socket/socket.js
import { io } from "socket.io-client";

let socketInstance = null;
// ✅ URL trỏ về backend (thường từ .env)
// const SOCKET_URL = import.meta.env.REACT_APP_SERVER_BASE_URLSV || "http://localhost:9000";

export const getSocket = () => {
    if (!socketInstance) {
        socketInstance = io(import.meta.env.REACT_APP_SERVER_BASE_URLSV || "http://localhost:9000", {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            transports: ["websocket"],
        });
        console.log("🧩 Socket instance created");
    }
    return socketInstance;
};

// ✅ Export mặc định
export default getSocket();
