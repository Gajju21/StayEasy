import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = sessionStorage.getItem("role"); // Get role from sessionStorage
  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to="/NotFound-404" />
  );
};

export default ProtectedRoute;
