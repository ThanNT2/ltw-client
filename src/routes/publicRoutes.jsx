import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import Sidebar from "../components/layout/Sidebar/MainSidebar";

// Pages
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

const publicRoutes = [
  // Home → bọc trong MainLayout
  {
    path: "/",
    element: (
      <MainLayout
        header={<Header />}
        sidebar={<Sidebar />}
        footer={<Footer />}
      >
        <HomePage />
      </MainLayout>
    ),
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
];

export default publicRoutes;
