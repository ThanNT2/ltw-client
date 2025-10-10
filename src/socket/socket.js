// src/socket/socket.js
import { io } from "socket.io-client";

// ✅ URL trỏ về backend (thường từ .env)
const SOCKET_URL = import.meta.env.REACT_APP_SERVER_BASE_URLSV || "http://localhost:9000";

const socket = io(SOCKET_URL, {
    transports: ["websocket"], // bắt buộc để tránh lỗi CORS
    autoConnect: false, // chỉ connect khi user đăng nhập
    withCredentials: true,
    transports: ["websocket"],
});

export default socket;
