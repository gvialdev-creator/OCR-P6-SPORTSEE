import { Outlet } from "react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";

/**
 * Layout for protected routes.
 * Wraps all nested routes with authentication checks.
 */
export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
