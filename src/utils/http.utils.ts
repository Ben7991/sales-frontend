import { getHeaders, refreshToken } from "./auth.util";
import { FAILED_STATUS_CODES } from "./constants.utils";
import { StatusCodes } from "./types.utils";

type MutationType = "POST" | "PATCH" | "PUT";

/**
 * This function is desired to be make http request with methods for
 * POST, PATCH and PUT only. Again, this function is only to be used for
 * making authenticated request to the preferred endpoint with the needed data
 * @param {unknown} data The data that needs to be sent to the endpoint
 * @param {string} endpoint the api url to which the request needs to be processed
 * @param {MutationType} mutation This indicates the http method
 * @returns {Promise<T>}
 */
export async function mutate<T>(
  data: unknown,
  endpoint: string,
  mutation: MutationType,
): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/${endpoint}`, {
    method: mutation,
    body: JSON.stringify(data),
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await mutate(data, endpoint, mutation);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
/**
 * This function is desired to be make http request with methods for
 * DELETE only. Again, this function is only to be used for
 * making authenticated request to the preferred endpoint with the needed data
 * @param endpoint the api url to which the request needs to be processed
 * @returns
 */
export async function destroy(endpoint: string): Promise<{ message: string }> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await destroy(endpoint);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

/**
 * This function is desired to be make authenticated http request for GET only
 * @param endpoint the api url to which the request needs to be processed
 * @returns {Promise<T>}
 */
export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/${endpoint}`, {
    method: "GET",
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await get(endpoint);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
