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
    <div className={styles.authWrapper}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Đặt lại mật khẩu</h2>

        <PasswordInput
          id="newPassword"
          name="newPassword"
          label="Mật khẩu mới"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          Đặt lại mật khẩu
        </button>

        <div className={styles.links}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
