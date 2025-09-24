// src/pages/Auth/ResetPasswordPage.jsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordThunk } from "../../stores/thunks/userThunks";
import styles from "./Auth.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function ResetPasswordPage() {
  const { token } = useParams(); // lấy token từ URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.user.loading);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.newPassword) nextErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (formData.newPassword && formData.newPassword.length < 8) nextErrors.newPassword = "Mật khẩu mới tối thiểu 8 ký tự";
    if (!formData.confirmPassword) nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) return;

    try {
      const action = await dispatch(
        resetPasswordThunk({ token, data: { newPassword: formData.newPassword } })
      );
      if (action.meta.requestStatus === "fulfilled") {
        setMessage("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
        // Điều hướng về login sau một chút
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMessage(action.payload?.message || "Đặt lại mật khẩu thất bại");
      }
    } catch (err) {
      setMessage(err?.message || "Đặt lại mật khẩu thất bại");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Đặt lại mật khẩu</h2>
      <p style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center", marginBottom: "1.5rem" }}>
        Nhập mật khẩu mới để hoàn tất việc đặt lại
      </p>

      {message && (
        <div
          style={{
            background: message.includes("thất bại") ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
            border: message.includes("thất bại") ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)",
            color: message.includes("thất bại") ? "#fca5a5" : "#86efac",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <PasswordInput
        id="newPassword"
        name="newPassword"
        label="Mật khẩu mới"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="Nhập mật khẩu mới"
        required
      />
      {errors.newPassword && (
        <div style={{ color: "#fca5a5", marginTop: 6, fontSize: 13 }}>{errors.newPassword}</div>
      )}

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Xác nhận mật khẩu mới"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Nhập lại mật khẩu mới"
        required
      />
      {errors.confirmPassword && (
        <div style={{ color: "#fca5a5", marginTop: 6, fontSize: 13 }}>{errors.confirmPassword}</div>
      )}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
      </button>

      <div className={styles.links}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </form>
  );
}

export default ResetPasswordPage;
