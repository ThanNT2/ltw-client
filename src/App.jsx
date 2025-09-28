import { Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// debug
import TokenDebug from "./debug/TokenDebug.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map((route, index) => {
          if (route.children) {
            // Handle nested routes
            return (
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
            );
          } else {
            // Handle simple routes
            return (
              <Route key={`public-${index}`} path={route.path} element={route.element} />
            );
          }
        })}

        {/* Private routes (support nested) */}
        {privateRoutes.map((route, index) => {
          if (route.children) {
            return (
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
            );
          }
          return (
            <Route
              key={`private-${index}`}
              path={route.path}
              element={<PrivateRoute>{route.element}</PrivateRoute>}
            />
          );
        })}
      </Routes>

      {/* Debug tool (dev only) */}
      {/* <TokenDebug /> */}
    </ErrorBoundary>
  );
}

export default App;
