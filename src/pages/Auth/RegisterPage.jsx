// src/pages/Auth/RegisterPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register data:", formData);
    // TODO: gọi API register
  };

  return (
    <div className={styles.authWrapper}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Đăng ký</h2>

        <div className={styles.formGroup}>
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles.submitBtn}>
          Đăng ký
        </button>

        <div className={styles.links}>
          <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
