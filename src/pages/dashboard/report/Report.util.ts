import { getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import { StatusCodes } from "@/utils/types.utils";
import type {
  MoneySharingResponse,
  Paginate,
  RecordRange,
} from "./Report.types";

export async function getMoneySharing(
  paginate: Paginate,
  range: RecordRange,
): Promise<MoneySharingResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (paginate.page - 1).toString());
  searchParams.set("perPage", paginate.perPage.toString());
  searchParams.set("q", paginate.query.toString());
  searchParams.set("startDate", range.startDate);
  searchParams.set("endDate", range.endDate);

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/report/money-sharing?${searchParams.toString()}`,
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
      return await getMoneySharing(paginate, range);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
