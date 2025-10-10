// src/layouts/UserLayout/UserLayout.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import UserSidebar from "../../components/layout/Sidebar/UserSidebar";
import styles from "./UserLayout.module.scss";
import { selectCurrentUser } from "../../stores/selectors/userSelectors";

const UserLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null);
  const currentUser = useSelector(selectCurrentUser);


  // 🔹 Lấy thông tin người dùng từ localStorage khi load layout
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("currentUser");
  //   if (storedUser) {
  //     try {
  //       setCurrentUser(JSON.parse(storedUser));

  //     } catch (error) {
  //       console.error("Lỗi khi parse currentUser:", error);
  //     }
  //   }
  // }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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

        {/* ✅ Truyền currentUser sang Sidebar */}
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentUser={currentUser}
        />

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
