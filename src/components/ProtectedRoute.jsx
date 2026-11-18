
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      sessionStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch {
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
