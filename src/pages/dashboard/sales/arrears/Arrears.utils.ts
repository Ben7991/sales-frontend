import { getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import {
  StatusCodes,
  type ResponseWithOnlyData,
  type ResponseWithRecord,
} from "@/utils/types.utils";
import type { ArrearsOrder, ArrearsRow } from "./Arrears.types";

export async function getArrears(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<ArrearsRow>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/report/arrears?${searchParams.toString()}`,
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
      return await getArrears(query, page, perPage);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function getArrearItem(
  id: number,
): Promise<ResponseWithOnlyData<Array<ArrearsOrder>>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/report/arrears/${id}`,
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
      return await getArrearItem(id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
