// src/debug/TokenDebug.js
import React, { useEffect } from "react";
import userService from "../services/userService";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../stores/selectors/userSelectors";

const TokenDebug = () => {
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        console.log("🔄 Calling /user/profile with token:", accessToken);

        const profile = await userService.getProfile();
        console.log("✅ Profile data:", profile);
      } catch (error) {
        console.error("❌ Error calling /user/profile:", error.message);
      }
    }, 10000); // gọi mỗi 10s

    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <div style={{ padding: "10px", background: "#f9f9f9", fontSize: "14px" }}>
      <strong>🛠 Token Debug:</strong> Gọi /user/profile mỗi 10s (xem console log)
    </div>
  );
};

export default TokenDebug;
