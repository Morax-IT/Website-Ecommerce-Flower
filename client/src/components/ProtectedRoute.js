import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  // Lấy user từ localStorage
  const { user } = useAuth();

  // Nếu chưa đăng nhập → redirect login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có allowedRoles nhưng user.role không phù hợp → redirect home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
