import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginThunk } from "../../stores/thunks/userThunks";
import PasswordInput from "../../components/common/PasswordInput";
import styles from "./Auth.module.scss";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = useSelector((state) => state.user?.accessToken);
  const tokenExpiresAt = useSelector((state) => state.user?.tokenExpiresAt);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isTokenValid =
    !!accessToken && (!tokenExpiresAt || Date.now() < tokenExpiresAt);

  // ✅ chỉ redirect khi token còn hạn
  React.useEffect(() => {
    if (isTokenValid) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isTokenValid, navigate, location.state]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(loginThunk(credentials)).unwrap();

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <h2 className={styles.title}>Đăng nhập</h2>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Nhập email của bạn"
          required
        />
      </div>

      <PasswordInput
        label="Mật khẩu"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Nhập mật khẩu"
      />

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <div className={styles.links}>
        <Link to="/forgot-password">Quên mật khẩu?</Link>
        <Link to="/register">Đăng ký</Link>
      </div>
    </form>
  );
}

export default LoginPage;
