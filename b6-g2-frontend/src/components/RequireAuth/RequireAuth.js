import { json, Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  if (user?.role === allowedRoles || auth?.user?.role === allowedRoles) {
    return <Outlet />;
  } else if (user && allowedRoles === "UNAUTHOR") {
    return <Outlet />;
  } else if (user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
