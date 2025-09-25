import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.scss";
import { Menu, LogOut, User, LogIn, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../../stores/selectors/userSelectors";
import { logoutThunk } from "../../../stores/thunks/userThunks";
import axiosInstance from "../../../services/axiosInstance";

const Header = ({ onMenuToggle }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📌 Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 📌 Avatar fallback state
  const [avatarError, setAvatarError] = useState(false);

  /* ---------------------------
    🧠 Tính toán tên và coin
  ---------------------------- */
  const getDisplayName = (user) => {
    if (!user || !user.username) return "Khách";
    const trimmed = user.username.trim();
    return trimmed === "" ? "Khách" : trimmed;
  };

  const getTruncatedName = (name, maxLength = 10) => {
    if (!name) return "Khách";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };

  const displayName = isAuthenticated && user ? getDisplayName(user) : "Khách";
  const truncatedName = getTruncatedName(displayName);
  const coin = isAuthenticated && user?.coin ? user.coin : 0;

  /* ---------------------------
    📌 Đóng dropdown khi click ngoài
  ---------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------------------
    🔐 Xử lý đăng xuất
  ---------------------------- */
  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutThunk());
      if (logoutThunk.fulfilled.match(result)) {
        navigate("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsDropdownOpen(false);
  };

  /* ---------------------------
    🌐 Lấy serverOrigin tự động
  ---------------------------- */
  const serverOrigin = (() => {
    try {
      const baseURL = axiosInstance?.defaults?.baseURL || "";
      return new URL(baseURL).origin || "http://localhost:9000";
    } catch (_) {
      return "http://localhost:9000";
    }
  })();

  /* ---------------------------
    🖼️ Hàm chuẩn hóa URL avatar
  ---------------------------- */
  const resolveAvatarUrl = (src) => {
    if (!src) return `${serverOrigin}/uploads/avatars/default-avatar.png`;
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith("/")) return `${serverOrigin}${src}`;
    return `${serverOrigin}/${src.replace(/^\//, "")}`;
  };

  const avatarSrc = avatarError
    ? `${serverOrigin}/uploads/avatars/default-avatar.png`
    : resolveAvatarUrl(user?.avatar);

  const notificationCount = isAuthenticated && user ? 0 : 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/" aria-label="Go to home">
            <img src="/vite.svg" alt="Logo" />
          </Link>
        </div>

        {/* Links */}
        <div className={styles.links}>
          <a href="/pricing">Pricing</a>
          <a href="/docs">Docs</a>
        </div>

        {/* User section */}
        <div className={styles.userSection}>
          {isAuthenticated && user ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              {/* 🔔 Notification */}
              <div className={styles.notificationContainer}>
                <button className={styles.notificationBtn}>
                  <Bell size={24} />
                  {notificationCount > 0 && (
                    <span className={styles.notificationBadge}>
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* 👤 Avatar + coin */}
              <div
                className={styles.user}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className={styles.avatar}
                  onError={() => setAvatarError(true)}
                />
                <div className={styles.userInfo}>
                  <div className={styles.name}>{truncatedName}</div>
                  <div className={styles.coin}>{coin}</div>
                </div>
              </div>

              {/* 📂 Dropdown */}
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className={styles.dropdownAvatar}
                      onError={() => setAvatarError(true)}
                    />
                    <div className={styles.dropdownUserInfo}>
                      <div className={styles.dropdownName}>{displayName}</div>
                      <div className={styles.dropdownEmail}>
                        {user.email || user.username}
                      </div>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider}></div>

                  <div className={styles.dropdownMenu}>
                    <Link
                      to="/profile"
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>Thông tin cá nhân</span>
                    </Link>

                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* 📱 Toggle sidebar trên mobile */}
        <button className={styles.menuToggle} onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
