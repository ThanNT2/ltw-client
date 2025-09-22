// src/layouts/UserLayout/UserLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../MainLayout/Header"; // ✅ dùng chung Header với MainLayout
import Footer from "../MainLayout/Footer"; // ✅ dùng chung Footer
import UserSidebar from "./UserSidebar";   // Sidebar riêng cho user
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

        <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
