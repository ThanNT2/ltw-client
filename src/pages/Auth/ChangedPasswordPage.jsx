// src/pages/Auth/ChangePasswordPage.jsx
import { useState } from "react";
import styles from "./Auth.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Change password data:", formData);
    // TODO: gọi API change password
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>
      <p style={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center", marginBottom: "1.5rem" }}>
        Thay đổi mật khẩu để bảo mật tài khoản của bạn
      </p>

      <PasswordInput
        id="currentPassword"
        name="currentPassword"
        label="Mật khẩu hiện tại"
        value={formData.currentPassword}
        onChange={handleChange}
        placeholder="Nhập mật khẩu hiện tại"
        required
      />

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
        Đổi mật khẩu
      </button>
    </form>
  );
}

export default ChangePasswordPage;
