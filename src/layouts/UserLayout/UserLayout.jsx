// src/layouts/UserLayout/UserLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import UserSidebar from "../../components/layout/Sidebar/UserSidebar";
import styles from "./UserLayout.module.scss";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.userLayout}>
      {/* Header */}
      <Header onMenuToggle={handleToggleSidebar} />

      {/* Sidebar + Content */}
      <div className={styles.main}>
        {/* Overlay cho mobile */}
        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className={styles.content}>
          <Outlet /> {/* ✅ render page con */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;
