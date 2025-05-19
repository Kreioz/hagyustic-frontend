import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute Component
 * Protects routes that require authentication or admin access.
 *
 * @param {ReactNode} children - The component to render if access is granted
 * @param {boolean} adminOnly - Whether this route requires admin privileges
 */
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { token, user, isAuthenticated } = useSelector((state) => state.user);

  // Not logged in
  if (!token || !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in but not an admin for admin-only route
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
