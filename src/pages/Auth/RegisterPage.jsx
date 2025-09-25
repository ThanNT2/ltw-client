// src/pages/Auth/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../stores/thunks/userThunks";
import styles from "./Auth.module.scss";
import PasswordInput from "../../components/common/PasswordInput";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.user.loading);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.username || !formData.email || !formData.password) return;
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    const action = await dispatch(
      registerThunk({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
    );
    if (action.meta.requestStatus === "fulfilled") {
      navigate("/");
    } else {
      setError(action.payload?.message || "Đăng ký thất bại");
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Đăng ký</h2>
      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            marginBottom: "1.5rem",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="username">Tên đăng nhập</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nhập tên đăng nhập"
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
          placeholder="Nhập email của bạn"
          required
        />
      </div>

      <PasswordInput
        id="password"
        name="password"
        label="Mật khẩu"
        value={formData.password}
        onChange={handleChange}
        placeholder="Nhập mật khẩu"
        required
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Nhập lại mật khẩu"
        required
      />

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      <div className={styles.links}>
        <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
      </div>
    </form>
  );
}

export default RegisterPage;
