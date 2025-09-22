import ChangePasswordPage from "../pages/Auth/ChangedPasswordPage";
import UserProfilePage from "../pages/User/Profile/ProfilePage";
import UserLayout from "../layouts/UserLayout/UserLayout";

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
    ],
  },
];

export default privateRoutes;
