import { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@/store/index.util";
import type { AuthState } from "@/utils/types.utils";
import { setAuthUser } from "@/store/slice/auth/auth.slice";
import { getAuthUser } from "@/utils/auth.util";
import { Loader } from "@/components/atoms/loader/Loader";
import { AUTH_STATE, AUTH_STATE_VALUE } from "@/utils/constants.utils";

type CanDeactivateProps = {
  children: React.ReactNode;
};

export function CanDeactivate({
  children,
}: CanDeactivateProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [state, setState] = useState<AuthState>(
    user ? "authenticated" : "loading",
  );

  useEffect(() => {
    if (
      !localStorage.getItem(AUTH_STATE) ||
      localStorage.getItem(AUTH_STATE) !== AUTH_STATE_VALUE
    ) {
      setState("not-authenticated");
      return;
    }

    const fetchAuthUser = async (): Promise<void> => {
      try {
        const result = await getAuthUser();
        setState("authenticated");
        dispatch(
          setAuthUser({
            user: result.data,
          }),
        );
      } catch (error) {
        setState("not-authenticated");
        console.error("Failed to fetch authenticated user", error);
      }
    };

    if (!user) {
      fetchAuthUser();
    }
  }, [dispatch, user]);

  if (state === "loading") {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
