import ChangePasswordPage from "../pages/Auth/ChangedPasswordPage";
import UserProfilePage from "../pages/User/Profile/ProfilePage";
import UserLayout from "../layouts/UserLayout/UserLayout";
import UserManagement from "../pages/Admin/UserManagement/userManagement";

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
    ],
  },
];

export default privateRoutes;
