// src/pages/Auth/ResetPasswordPage.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./Auth.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function ResetPasswordPage() {
  const { token } = useParams(); // lấy token từ URL
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password data:", formData, "token:", token);
    // TODO: gọi API reset password
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Đặt lại mật khẩu</h2>
      <p style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center", marginBottom: "1.5rem" }}>
        Nhập mật khẩu mới để hoàn tất việc đặt lại
      </p>

      <PasswordInput
        id="newPassword"
        name="newPassword"
        label="Mật khẩu mới"
        value={formData.newPassword}
        onChange={handleChange}
        placeholder="Nhập mật khẩu mới"
        required
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Xác nhận mật khẩu mới"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Nhập lại mật khẩu mới"
        required
      />

      <button type="submit" className={styles.submitBtn}>
        Đặt lại mật khẩu
      </button>

      <div className={styles.links}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </form>
  );
}

export default ResetPasswordPage;
