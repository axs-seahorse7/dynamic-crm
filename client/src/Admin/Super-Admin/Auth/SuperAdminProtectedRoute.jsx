import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const SuperAdminProtectedRoute = () => {
  const { isAuthenticated } = useSelector(
    (state) => state.superAdminAuth
  );

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default SuperAdminProtectedRoute;
