// src/components/layout/UserLayout/UserSidebar.jsx
import React from "react";
import styles from "./UserSidebar.module.scss";
import { NavLink } from "react-router-dom";
import useUserMenu from "../../../hooks/useUserMenu";

const UserSidebar = ({ isOpen, onClose, role }) => {
  const menus = useUserMenu(role);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <h2>Menu</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className={styles.menu}>
        {menus.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ""}`
            }
            onClick={onClose}
          >
            <Icon size={18} className={styles.icon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default UserSidebar;
