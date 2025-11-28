import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("token"); // or use context

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
