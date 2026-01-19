import {
  StatusCodes,
  type ResponseWithOnlyData,
  type User,
} from "@/utils/types.utils";
import { FAILED_STATUS_CODES } from "./constants.utils";

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

export function getHeaders(withAuth?: boolean): Headers {
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
    },
  );

  if (response.status !== StatusCodes.SUCCESS) {
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

export async function checkUsername(username: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/users/check-username`,
    {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: getHeaders(true),
      credentials: "include",
    },
  );

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await checkUsername(username);
    }
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error("Failed");
  }
}

export async function checkEmail(email: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/users/check-email`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: getHeaders(true),
      credentials: "include",
    },
  );

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await checkEmail(email);
    }
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error("Failed");
  }
}
