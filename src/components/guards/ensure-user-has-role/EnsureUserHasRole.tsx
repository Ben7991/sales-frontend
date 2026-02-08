import { Navigate } from "react-router";

import { useAppSelector } from "@/store/index.util";
import type { Role } from "@/utils/types.utils";

type EnsureIsAdminProps = {
  children: React.ReactNode;
  roles: Array<Role>;
};

export function EnsureUserHasRole({
  children,
  roles,
}: EnsureIsAdminProps): React.ReactNode {
  const { user } = useAppSelector((state) => state.auth);

  if (user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
