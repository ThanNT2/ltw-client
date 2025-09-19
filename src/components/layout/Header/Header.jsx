// src/components/layout/Header/Header.jsx
import React from "react";
import styles from "./Header.module.scss";
import { Menu } from "lucide-react";

const Header = ({ user, onMenuToggle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* Links / Spacer */}
        <div className={styles.links}>
          <a href="/pricing">Pricing</a>
          <a href="/docs">Docs</a>
        </div>

        {/* User info */}
        <div className={styles.user}>
          {user && (
            <>
              <img src={user.avatar} alt="Avatar" className={styles.avatar} />
              <span className={styles.name}>{user.name}</span>
              <span className={styles.coin}>{user.coin} 💰</span>
            </>
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
