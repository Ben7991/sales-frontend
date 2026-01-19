import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router";

import { Loader } from "@/components/atoms/loader/Loader";
import { verifyResetPasswordToken } from "@/utils/auth.util";

export type ResetPasswordActivateProps = {
  children: React.ReactNode;
};

type ValidationState = "loading" | "valid" | "not-valid";

export function ResetPasswordActivate({
  children,
}: ResetPasswordActivateProps): React.ReactNode {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<ValidationState>("loading");

  useEffect(() => {
    const verifyToken = async (): Promise<void> => {
      try {
        await verifyResetPasswordToken(token);
        setState("valid");
      } catch (error) {
        setState("not-valid");
        console.error("Failed to verify reset token", error);
      }
    };

    verifyToken();
  }, [token]);

  if (!token || state === "not-valid") {
    return <Navigate to="/" />;
  }

  if (state === "loading") {
    return <Loader />;
  }

  return children;
}
