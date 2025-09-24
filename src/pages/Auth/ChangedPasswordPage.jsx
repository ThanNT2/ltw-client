// src/pages/Auth/ChangePasswordPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordThunk } from "../../stores/thunks/userThunks";
import authStyles from "./Auth.module.scss";
import styles from "./ChangedPasswordPage.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function ChangePasswordPage() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccessMsg("");
    try {
      const action = await dispatch(
        changePasswordThunk({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      );
      if (action.meta.requestStatus === "fulfilled") {
        setSuccessMsg("Đổi mật khẩu thành công");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: action.payload?.message || "Đổi mật khẩu thất bại",
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.message || "Đổi mật khẩu thất bại",
      }));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Đổi mật khẩu</h2>
        <p className={styles.subtitle}>Thay đổi mật khẩu để bảo mật tài khoản của bạn</p>

        <form className={`${authStyles.authForm} ${styles.lightForm} ${styles.form}`} onSubmit={handleSubmit}>
          {successMsg && <div className={styles.successText}>{successMsg}</div>}
          {errors.submit && <div className={styles.errorText}>{errors.submit}</div>}
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
              <button type="submit" disabled={!isValid || loading} className={`${authStyles.submitBtn} ${styles.primaryButton}`}>
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
