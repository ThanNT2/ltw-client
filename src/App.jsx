import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import useSocket from "./hooks/useSocket";
import { selectIsAuthenticated } from "./stores/selectors/userSelectors";
import useSocketListeners from "./hooks/useSocketListeners";
// import TokenDebug from "./debug/TokenDebug"; // bật khi cần debug token/socket

function App() {
  // Chỉ cần biết user đã đăng nhập hay chưa (middleware đã tự xử lý connect)
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Hook khởi tạo socket nền (không cần truyền userId nữa)
  useSocket();
  useSocketListeners();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map((route, index) =>
          route.children ? (
            <Route key={`public-${index}`} path={route.path} element={route.element}>
              {route.children.map((child, childIndex) => (
                <Route
                  key={`public-${index}-${childIndex}`}
                  index={child.index}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ) : (
            <Route
              key={`public-${index}`}
              path={route.path}
              element={route.element}
            />
          )
        )}

        {/* Private routes */}
        {privateRoutes.map((route, index) =>
          route.children ? (
            <Route
              key={`private-${index}`}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            >
              {route.children.map((child, childIndex) => (
                <Route
                  key={`private-${index}-${childIndex}`}
                  index={child.index}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ) : (
            <Route
              key={`private-${index}`}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          )
        )}
      </Routes>

      {/* 🔧 Debug tool (dev only) */}
      {/* {import.meta.env.DEV && <TokenDebug />} */}
    </ErrorBoundary>
  );
}

export default App;
