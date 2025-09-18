import React from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.scss";

const ForgotPasswordPage = () => {
  return (
    <div className={styles.authWrapper}>
      <form className={styles.authForm}>
        <h2 className={styles.title}>Quên mật khẩu</h2>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" placeholder="Nhập email để khôi phục" required />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Gửi liên kết đặt lại mật khẩu
        </button>

        <div className={styles.links}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
