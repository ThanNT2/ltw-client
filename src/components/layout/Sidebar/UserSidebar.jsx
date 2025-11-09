import React, { useState } from "react";
import styles from "./UserSidebar.module.scss";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  User,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";

const UserSidebar = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState({
    user: true,
    dashboard: false,
    vaults: false,
  });

  const toggle = (section) =>
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  // ✅ Lấy currentUser từ Redux store
  const currentUser = useSelector((state) => state.user.currentUser);
  const role = currentUser?.role || "user";
  const canSeeDashboard = ["admin", "moderator"].includes(role);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.sidebarHeader}>
        <h2>Menu</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className={styles.menu}>
        {/* --- User section --- */}
        <button
          type="button"
          className={`${styles.menuItem} ${styles.parentItem}`}
          onClick={() => toggle("user")}
        >
          <div className={styles.leftGroup}>
            <User size={18} className={styles.icon} />
            <span>User</span>
          </div>
          <span className={styles.arrowIcon}>
            {open.user ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </button>

        {open.user && (
          <div className={styles.submenu}>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.submenuItem} ${isActive ? styles.active : ""}`
              }
              onClick={onClose}
            >
              Profile
            </NavLink>
            <NavLink
              to="/change-password"
              className={({ isActive }) =>
                `${styles.submenuItem} ${isActive ? styles.active : ""}`
              }
              onClick={onClose}
            >
              Change Password
            </NavLink>
          </div>
        )}

        {/* --- Dashboard section (admin/mod only) --- */}
        {canSeeDashboard && (
          <>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.parentItem}`}
              onClick={() => toggle("dashboard")}
            >
              <div className={styles.leftGroup}>
                <LayoutDashboard size={18} className={styles.icon} />
                <span>Dashboard</span>
              </div>
              <span className={styles.arrowIcon}>
                {open.dashboard ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
            </button>

            {open.dashboard && (
              <div className={styles.submenu}>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `${styles.submenuItem} ${isActive ? styles.active : ""}`
                  }
                  onClick={onClose}
                >
                  Users
                </NavLink>

                <NavLink
                  to="/dashboard/transactions"
                  className={({ isActive }) =>
                    `${styles.submenuItem} ${isActive ? styles.active : ""}`
                  }
                  onClick={onClose}
                >
                  Transactions
                </NavLink>

                {/* 🟣 Vaults parent menu */}
                <button
                  type="button"
                  className={`${styles.submenuItem} ${styles.parentSubItem}`}
                  onClick={() => toggle("vaults")}
                >
                  <div className={styles.leftGroup}>
                    <Layers size={16} className={styles.icon} />
                    <span>Vaults</span>
                  </div>
                  <span className={styles.arrowIcon}>
                    {open.vaults ? (
                      <ChevronDown size={12} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                  </span>
                </button>

                {/* Vaults submenu list */}
                {open.vaults && (
                  <div className={styles.subsubmenu}>
                    <NavLink
                      to="/dashboard/vaults/master"
                      className={({ isActive }) =>
                        `${styles.submenuItem} ${isActive ? styles.active : ""}`
                      }
                      onClick={onClose}
                    >
                      Vault Master
                    </NavLink>

                    <NavLink
                      to="/dashboard/vaults/airdrop"
                      className={({ isActive }) =>
                        `${styles.submenuItem} ${isActive ? styles.active : ""}`
                      }
                      onClick={onClose}
                    >
                      Vault Airdrop
                    </NavLink>

                    <NavLink
                      to="/dashboard/vaults/reward"
                      className={({ isActive }) =>
                        `${styles.submenuItem} ${isActive ? styles.active : ""}`
                      }
                      onClick={onClose}
                    >
                      Vault Reward
                    </NavLink>

                    <NavLink
                      to="/dashboard/vaults/transactions"
                      className={({ isActive }) =>
                        `${styles.submenuItem} ${isActive ? styles.active : ""}`
                      }
                      onClick={onClose}
                    >
                      Vault Transactions
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default UserSidebar;
