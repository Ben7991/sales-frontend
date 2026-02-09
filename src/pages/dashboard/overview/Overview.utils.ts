import { StatusCodes, type ResponseWithOnlyData } from "@/utils/types.utils";
import type { EntitySummary, HighValueCustomer } from "./Overview.types";
import { getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";

export async function getEntitySummary(): Promise<
  ResponseWithOnlyData<EntitySummary>
> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/dashboard/summary`,
    {
      method: "GET",
      headers: getHeaders(true),
      credentials: "include",
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await getEntitySummary();
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function getHighValueCustomers(): Promise<
  ResponseWithOnlyData<Array<HighValueCustomer>>
> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/dashboard/high-value-customers`,
    {
      method: "GET",
      headers: getHeaders(true),
      credentials: "include",
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await getHighValueCustomers();
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
