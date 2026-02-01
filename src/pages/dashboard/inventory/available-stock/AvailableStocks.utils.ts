import { getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import {
  StatusCodes,
  type ProductStock,
  type ResponseWithRecord,
} from "@/utils/types.utils";

export const availableStockColumnHeadings = [
  "Product",
  "Supplier",
  "Unit Price(retail)",
  "Unit Price(wholesale)",
  "Box No.",
  "Total Pieces",
  "Status",
];

export async function getProductStock(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<ProductStock>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/products/stocks?${searchParams.toString()}`,
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
      return await getProductStock(query, page, perPage);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
