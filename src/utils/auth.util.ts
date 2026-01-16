import {
  StatusCodes,
  type ResponseWithOnlyData,
  type User,
} from "@/utils/types.utils";

function getAccessToken(): string {
  const cookies = document.cookie;
  const accessTokenCookie = cookies
    .split(";")
    .filter((cookie) => cookie.trim().startsWith("_acc-tk="))[0];

  if (!accessTokenCookie) {
    return "";
  }

  return accessTokenCookie.split("=")[1];
}

export function getHeaders(withAuth: boolean): Headers {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  if (withAuth) {
    headers.append("authorization", `Bearer ${getAccessToken()}`);
  }

  return headers;
}

export async function refreshToken(): Promise<boolean> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/auth/refresh-token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.status) {
    return false;
  }

  return true;
}

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
