import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

// Pages
import HomePage from "../pages/Home/HomePage";
import Dashboard from "../pages/Dashboard/DashboardPage";
import NotFoundPage from "../pages/Errors/NotFoundPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

const publicRoutes = [
  // MainLayout with nested routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      // Add more nested routes here as needed
      // {
      //   path: "profile",
      //   element: <ProfilePage />,
      // },
    ],
  },

  // Auth pages → bọc trong AuthLayout
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },

  // 404 Not Found - Catch all route
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default publicRoutes;
