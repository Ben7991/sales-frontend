import { getHeaders, refreshToken } from "@/utils/auth.util";
import {
  StatusCodes,
  type ResponseWithOnlyData,
  type User,
} from "@/utils/types.utils";

export async function getAuthUser(): Promise<ResponseWithOnlyData<User>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/user`, {
    method: "GET",
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await getAuthUser();
    }
    throw new Error(result.message);
  }

  return result;
}
