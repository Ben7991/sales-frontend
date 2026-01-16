import { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { useAppDispatch, useAppSelector } from "@/store/index.util";
import { Loader } from "@/components/atoms/loader/Loader";
import { getAuthUser } from "@/utils/auth.util";
import { setAuthUser } from "@/store/slice/auth/auth.slice";
import type { AuthState } from "@/utils/types.utils";

export type CanActivateProps = {
  children: React.ReactNode;
};

export function CanActivate({ children }: CanActivateProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [state, setState] = useState<AuthState>(
    user ? "authenticated" : "loading"
  );

  useEffect(() => {
    const fetchAuthUser = async (): Promise<void> => {
      try {
        const result = await getAuthUser();
        setState("authenticated");
        dispatch(
          setAuthUser({
            user: result.data,
          })
        );
      } catch (error) {
        setState("not-authenticated;");
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

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}
