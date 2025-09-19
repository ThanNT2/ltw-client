import React from "react";
import styles from "./AuthLayout.module.scss";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authContainer}>
        {/* Logo / Title */}
        <div className={styles.authHeader}>
          <h1 className={styles.logo}>MyApp</h1>
        </div>

        {/* Content (Form Login/Register/etc.) */}
        <div className={styles.authContent}>{children}</div>

        {/* Footer nhỏ */}
        <div className={styles.authFooter}>
          <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
