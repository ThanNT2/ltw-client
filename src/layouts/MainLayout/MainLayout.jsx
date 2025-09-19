// src/layouts/MainLayout/MainLayout.jsx
import React, { useState } from "react";
import styles from "./MainLayout.module.scss";
import { X } from "lucide-react";


// Layout components
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/MainSidebar";
import Footer from "../../components/layout/Footer/Footer";


const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={styles.mainLayout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Header onMenuToggle={() => setDrawerOpen(true)} />
        </div>
      </header>

      {/* Sidebar (desktop + mobile drawer) */}
      <aside
        className={`${styles.sidebar} ${drawerOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h2>Menu</h2>
          <button
            className={styles.closeBtn}
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* Overlay for mobile */}
      {drawerOpen && (
        <div
          className={styles.overlay}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={styles.content}>{children}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
