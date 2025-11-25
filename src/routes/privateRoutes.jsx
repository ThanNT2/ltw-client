import ChangePasswordPage from "../pages/Auth/ChangedPasswordPage";
import UserProfilePage from "../pages/User/Profile/ProfilePage";
import UserLayout from "../layouts/UserLayout/UserLayout";
import UserManagement from "../pages/Admin/UserManagement/userManagement";
import VaultMaster from "../pages/Vaults/VaultMaster/vaultMaster";

const privateRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      {
        path: "admin/users",
        element: <UserManagement />,
      },
      {
        path: "vaults/master",
        element: <VaultMaster />,
      },
    ],
  },
];

export default privateRoutes;
