import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordThunk } from "../../stores/thunks/userThunks";
import styles from "./Auth.module.scss";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const action = await dispatch(forgotPasswordThunk(email));
      if (action.meta.requestStatus === "fulfilled") {
        setMessage("Đã gửi liên kết đặt lại mật khẩu đến email của bạn!");
      } else {
        setMessage(action.payload?.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Quên mật khẩu</h2>
      <p style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center", marginBottom: "1.5rem" }}>
        Nhập email để nhận liên kết đặt lại mật khẩu
      </p>

      {message && (
        <div className={message.includes("lỗi") ? styles.error : ""} style={{
          background: message.includes("lỗi") ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
          border: message.includes("lỗi") ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)",
          color: message.includes("lỗi") ? "#fca5a5" : "#86efac",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          textAlign: "center"
        }}>
          {message}
        </div>
      )}

      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email để khôi phục"
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
      </button>

      <div className={styles.links}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </form>
  );
};

export default ForgotPasswordPage;
