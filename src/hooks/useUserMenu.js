// src/hooks/useUserMenu.js
import { useMemo } from "react";
import {
  Home,
  User,
  Settings,
  Shield,
  Coins,
  LogOut,
} from "lucide-react";

export default function useUserMenu(role = "guest") {
  const menus = useMemo(() => {
    const baseMenu = [
      { label: "Dashboard", path: "/user/dashboard", icon: Home },
      { label: "Profile", path: "/user/profile", icon: User },
      { label: "Settings", path: "/user/settings", icon: Settings },
    ];

    const adminMenu = [
      { label: "Manage Users", path: "/admin/users", icon: Shield },
      { label: "Vault", path: "/admin/vault", icon: Coins },
    ];

    const guestMenu = [
      { label: "Login", path: "/login", icon: User },
      { label: "Register", path: "/register", icon: User },
    ];

    const logout = { label: "Logout", path: "/logout", icon: LogOut };

    switch (role) {
      case "admin":
        return [...baseMenu, ...adminMenu, logout];
      case "user":
        return [...baseMenu, logout];
      default:
        return guestMenu;
    }
  }, [role]);

  return menus;
}
