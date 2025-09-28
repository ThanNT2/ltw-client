// src/components/layout/UserLayout/UserSidebar.jsx
import React, { useState } from "react";
import styles from "./UserSidebar.module.scss";
import { NavLink } from "react-router-dom";
import { User, LayoutDashboard, ChevronDown, ChevronRight, Shield } from "lucide-react";

const UserSidebar = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState({ user: true, dashboard: false });

  const toggle = (section) => setOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <h2>Menu</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className={styles.menu}>
        {/* User section */}
        <button
          type="button"
          className={`${styles.menuItem} ${styles.parentItem}`}
          onClick={() => toggle("user")}
        >
          {open.user ? <ChevronDown size={16} className={styles.icon} /> : <ChevronRight size={16} className={styles.icon} />}
          <User size={18} className={styles.icon} />
          <span>User</span>
        </button>
        {open.user && (
          <div className={styles.submenu}>
            <NavLink
              to="/profile"
              className={({ isActive }) => `${styles.submenuItem} ${isActive ? styles.active : ""}`}
              onClick={onClose}
            >
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/change-password"
              className={({ isActive }) => `${styles.submenuItem} ${isActive ? styles.active : ""}`}
              onClick={onClose}
            >
              <span>Change password</span>
            </NavLink>
          </div>
        )}

        {/* Dashboard section */}
        <button
          type="button"
          className={`${styles.menuItem} ${styles.parentItem}`}
          onClick={() => toggle("dashboard")}
        >
          {open.dashboard ? <ChevronDown size={16} className={styles.icon} /> : <ChevronRight size={16} className={styles.icon} />}
          <LayoutDashboard size={18} className={styles.icon} />
          <span>Dashboard</span>
        </button>
        {open.dashboard && (
          <div className={styles.submenu}>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `${styles.submenuItem} ${isActive ? styles.active : ""}`}
              onClick={onClose}
            >
              <span>Users</span>
            </NavLink>
            <NavLink
              to="/dashboard/transactions"
              className={({ isActive }) => `${styles.submenuItem} ${isActive ? styles.active : ""}`}
              onClick={onClose}
            >
              <span>Transactions</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default UserSidebar;
