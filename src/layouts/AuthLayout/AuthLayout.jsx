import React from "react";
import { Link } from "react-router-dom";
import styles from "./AuthLayout.module.scss";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      {/* Background Pattern */}
      <div className={styles.backgroundPattern}></div>

      {/* Header */}
      <header className={styles.authHeader}>
        <Link to="/" className={styles.logo}>
          <img src="/vite.svg" alt="Logo" />
          <span>MyApp</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className={styles.authContent}>
        <div className={styles.authContainer}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.authFooter}>
        <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
