import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { getCurrentUserRole } from "./getCurrentUserRole";
import type { UserType } from "../../features/user/user";

interface RoleProtectedRouteProps {
  allowedRoles: UserType[];
  children: ReactNode;
}

const RoleProtectedRoute = ({
  allowedRoles,
  children,
}: RoleProtectedRouteProps) => {
  const role = getCurrentUserRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }


  return <>{children}</>;
};

export default RoleProtectedRoute;