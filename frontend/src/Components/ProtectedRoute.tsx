import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/auth/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  blockAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  blockAdmin = false,
}: ProtectedRouteProps) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (blockAdmin && isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
