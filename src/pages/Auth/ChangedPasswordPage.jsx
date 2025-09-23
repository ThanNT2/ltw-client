// src/pages/Auth/ChangePasswordPage.jsx
import { useState } from "react";
import authStyles from "./Auth.module.scss";
import styles from "./ChangedPasswordPage.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const isValid =
    formData.currentPassword &&
    formData.newPassword &&
    formData.newPassword.length >= 8 &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.currentPassword) nextErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    if (!formData.newPassword) nextErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (formData.newPassword && formData.newPassword.length < 8) nextErrors.newPassword = "Mật khẩu mới tối thiểu 8 ký tự";
    if (!formData.confirmPassword) nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Change password data:", formData);
    // TODO: gọi API change password
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Đổi mật khẩu</h2>
        <p className={styles.subtitle}>Thay đổi mật khẩu để bảo mật tài khoản của bạn</p>

        <form className={`${authStyles.authForm} ${styles.lightForm} ${styles.form}`} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.label}>Mật khẩu hiện tại</div>
            <div className={styles.control}>
              <PasswordInput
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                required
                buttonColor="#4b5563"
              />
              {errors.currentPassword && (
                <div className={styles.errorText}>{errors.currentPassword}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.label}>Mật khẩu mới</div>
            <div className={styles.control}>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                required
                buttonColor="#4b5563"
              />
              <div className={styles.help}>Tối thiểu 8 ký tự, bao gồm chữ và số.</div>
              {errors.newPassword && (
                <div className={styles.errorText}>{errors.newPassword}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.label}>Xác nhận mật khẩu mới</div>
            <div className={styles.control}>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                required
                buttonColor="#4b5563"
              />
              {errors.confirmPassword && (
                <div className={styles.errorText}>{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.cancelBtn} onClick={() => setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })}>
              Hủy
            </button>
            <div className={styles.actions}>
              <button type="submit" disabled={!isValid} className={`${authStyles.submitBtn} ${styles.primaryButton}`}>
                Xác nhận
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
