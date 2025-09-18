import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
function PrivateRoute({ children }) {
  // Lấy accessToken từ Redux authSlice
  const accessToken = useSelector((state) => state.user?.accessToken);
  const location = useLocation();

  if (!accessToken) {
    // Nếu chưa login thì redirect về /login
    // Lưu lại đường dẫn hiện tại để login xong có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu đã login thì cho phép render trang được bảo vệ
  return children;
}

export default PrivateRoute;
