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
    <div className={styles.authWrapper}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Đổi mật khẩu</h2>

        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          label="Mật khẩu hiện tại"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />

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
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;
