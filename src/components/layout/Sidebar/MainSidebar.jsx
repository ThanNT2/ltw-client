// src/components/layout/Sidebar/MainSidebar.jsx
import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import {
  Home,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  FileText,
  Shield,
  CreditCard,
  Users,
  HelpCircle,
  Bell
} from "lucide-react";

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard'
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      children: [
        { label: 'Overview', href: '/analytics/overview' },
        { label: 'Reports', href: '/analytics/reports' },
        { label: 'Charts', href: '/analytics/charts' }
      ]
    },
    {
      key: 'documents',
      label: 'Documents',
      icon: FileText,
      children: [
        { label: 'All Documents', href: '/documents' },
        { label: 'Templates', href: '/documents/templates' },
        { label: 'Shared', href: '/documents/shared' }
      ]
    },
    {
      key: 'security',
      label: 'Security',
      icon: Shield,
      children: [
        { label: 'Two-Factor Auth', href: '/security/2fa' },
        { label: 'API Keys', href: '/security/api-keys' },
        { label: 'Audit Logs', href: '/security/audit' }
      ]
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: CreditCard,
      children: [
        { label: 'Overview', href: '/billing' },
        { label: 'Invoices', href: '/billing/invoices' },
        { label: 'Payment Methods', href: '/billing/payment' }
      ]
    },
    {
      key: 'team',
      label: 'Team',
      icon: Users,
      children: [
        { label: 'Members', href: '/team/members' },
        { label: 'Invitations', href: '/team/invitations' },
        { label: 'Roles', href: '/team/roles' }
      ]
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile'
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings'
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/notifications'
    },
    {
      key: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      children: [
        { label: 'Documentation', href: '/help/docs' },
        { label: 'Contact Support', href: '/help/support' },
        { label: 'FAQ', href: '/help/faq' }
      ]
    }
  ];

  return (
    <nav className={styles.sidebarNav}>
      {menuItems.map((item) => (
        <div key={item.key} className={styles.menuItem}>
          {item.href ? (
            <a href={item.href} className={styles.item}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </a>
          ) : (
            <>
              <button
                className={styles.item}
                onClick={() => toggleMenu(item.key)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {expandedMenus[item.key] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              {expandedMenus[item.key] && item.children && (
                <div className={styles.submenu}>
                  {item.children.map((child, index) => (
                    <a
                      key={index}
                      href={child.href}
                      className={styles.submenuItem}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;
