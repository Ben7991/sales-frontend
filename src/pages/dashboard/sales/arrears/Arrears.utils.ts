import { getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import { StatusCodes, type ResponseWithOnlyData } from "@/utils/types.utils";
import type { ArrearsOrder } from "./Arrears.types";

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
