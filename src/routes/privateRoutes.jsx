import ChangePasswordPage from "../pages/Auth/ChangedPasswordPage";
import UserProfilePage from "../pages/User/ProfilePage";
// import DashboardPage from "../pages/Dashboard/DashboardPage";

const privateRoutes = [
  // {
  //   path: "/dashboard",
  //   element: <DashboardPage />,
  // },
  {
    path: "/profile",
    element: <UserProfilePage />,
  },
  {
    path: "/change-password",
    element: <ChangePasswordPage />, // 🔒 chỉ user login mới vào được
  },
];

export default privateRoutes;
