// src/components/layout/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.scss";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../../stores/selectors/userSelectors";

const Header = ({ onMenuToggle }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý user data với null safety
  const getDisplayName = (user) => {
    if (!user || !user.username) return "Khách";
    const trimmedUsername = user.username.trim();
    return trimmedUsername === "" ? "Khách" : trimmedUsername;
  };
  const getTruncatedName = (name, maxLength = 10) => {
    if (!name) return "Khách";
    return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
  };
  const displayName = isAuthenticated && user ? getDisplayName(user) : "Khách";
  const truncatedName = getTruncatedName(displayName);
  // Coin
  const coin = (isAuthenticated && user?.coin) ? user.coin : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
    setIsDropdownOpen(false);
  };
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/" aria-label="Go to home">
            <img src="/vite.svg" alt="Logo" />
          </Link>
        </div>

        {/* Links / Spacer */}
        <div className={styles.links}>
          <a href="/pricing">Pricing</a>
          <a href="/docs">Docs</a>
        </div>

        {/* User section - Login button or User info */}
        <div className={styles.userSection}>
          {isAuthenticated && user ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <div
                className={styles.user}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className={styles.avatar}
                  onError={(e) => {
                    e.target.src = "/vite.svg";
                  }}
                />
                <div className={styles.userInfo}>
                  <div className={styles.name}>
                    {truncatedName}
                  </div>
                  <div className={styles.coin}>
                    {coin} 
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className={styles.dropdownAvatar}
                      onError={(e) => {
                        e.target.src = "/vite.svg";
                      }}
                    />
                    <div className={styles.dropdownUserInfo}>
                      <div className={styles.dropdownName}>
                        {displayName}
                      </div>
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

                    {/* <Link
                      to="/settings"
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Cài đặt</span>
                    </Link> */}

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
              Login
            </Link>
          )}
        </div>

        {/* Menu toggle for mobile */}
        <button className={styles.menuToggle} onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
