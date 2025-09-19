import { Routes, Route } from "react-router-dom";
import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";
import PrivateRoute from "./components/PrivateRoute";

// debug
import TokenDebug from "./debug/TokenDebug.jsx";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map(({ path, element }, index) => (
          <Route key={`public-${index}`} path={path} element={element} />
        ))}

        {/* Private routes */}
        {privateRoutes.map(({ path, element }, index) => (
          <Route
            key={`private-${index}`}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))}
      </Routes>

      {/* Debug tool (dev only) */}
      {/* <TokenDebug /> */}
    </>
  );
}

export default App;
