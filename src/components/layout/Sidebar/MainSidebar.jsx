// src/components/layout/Sidebar/Sidebar.jsx
import React from "react";
import styles from "./Sidebar.module.scss";
import { Home, User, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <nav className={styles.sidebarNav}>
      <a href="/" className={styles.item}>
        <Home size={18} />
        <span>Home</span>
      </a>
      <a href="/profile" className={styles.item}>
        <User size={18} />
        <span>Profile</span>
      </a>
      <a href="/settings" className={styles.item}>
        <Settings size={18} />
        <span>Settings</span>
      </a>
    </nav>
  );
};

export default Sidebar;
