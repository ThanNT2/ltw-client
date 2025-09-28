import PrivateRoute from "../components/PrivateRoute";
import UserManagement from "../pages/Admin/UserManagement/userManagement.jsx";

const adminRoutes = [
  {
    path: "/admin/users",
    element: (
      <PrivateRoute>
        <UserManagement />
      </PrivateRoute>
    ),
  },
];

export default adminRoutes;


