import { Navigate } from "react-router-dom";
import { useAuth } from "./auth.js";

export default function PrivateRoute({ children }) {
  const { isAuthorized } = useAuth();

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}
