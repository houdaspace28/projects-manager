import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }
  return <>{children}</>;
}
