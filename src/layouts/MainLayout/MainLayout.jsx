// src/layouts/MainLayout/MainLayout.jsx
import React, { useState } from "react";
import styles from "./MainLayout.module.scss";

// Layout components
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/MainSidebar";
import Footer from "../../components/layout/Footer/Footer";

const MainLayout = ({ children, user }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.mainLayout}>
      {/* Header full width */}
      <Header user={user} onMenuToggle={() => setDrawerOpen(!drawerOpen)} />

      {/* Body: Sidebar + Content */}
      <div className={styles.body}>
        <Sidebar
          user={user}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        <main className={styles.content}>{children}</main>
      </div>

      {/* Footer full width */}
      <Footer />
    </div>
  );
};

export default MainLayout;
