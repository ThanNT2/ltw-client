// src/components/layout/Footer/Footer.jsx
import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footerInner}>
      <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
    </div>
  );
};

export default Footer;
