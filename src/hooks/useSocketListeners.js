import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket/socket";
import { logoutThunk } from "../stores/thunks/userThunks";
import { isForceLogout } from "../services/axiosInstance";

export default function useSocketListeners() {
    const dispatch = useDispatch();
    const { isAuthenticated, currentUser } = useSelector((state) => state.user);
    const isForceLogoutHandled = useRef(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const handleForceLogout = (payload) => {
            if (isForceLogoutHandled.current) return;
            isForceLogoutHandled.current = true;

            console.warn("🚫 force_logout:", payload);

            // ⚠️ bật cờ để Axios không gọi refresh-token / logout nữa
            isForceLogout.value = true; // ❗ nếu export là object { value: false }

            // Nếu bạn export là `export let isForceLogout = false;` thì dùng:
            // isForceLogout = true;

            // ✅ Gọi logoutThunk mà không gọi API (skipApi = true)
            dispatch(logoutThunk(true));

            socket.disconnect();
        };

        socket.on("force_logout", handleForceLogout);
        return () => socket.off("force_logout", handleForceLogout);
    }, [isAuthenticated, currentUser?._id, dispatch]);
}
