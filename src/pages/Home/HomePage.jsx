import React from "react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../stores/thunks/userThunks"; // đường dẫn chỉnh lại cho đúng

function HomePage() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <div>
      <h1>Xin chào, đây là HomePage!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
