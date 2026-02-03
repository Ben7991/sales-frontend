import {
  StatusCodes,
  type Order,
  type ResponseWithOnlyData,
  type ResponseWithRecord,
} from "@/utils/types.utils";
import type { OrderHistoryItem } from "./OrderHistory.types";
import { getAccessToken, getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

export const orderHistoryColumnHeadings = [
  "Order Number",
  "Date Created",
  "Customer",
  "Order Total",
  "Amount Paid",
  "Order Status",
  "Paid Status",
  "",
];

export async function getOrderHistories(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<OrderHistoryItem>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/sales?${searchParams.toString()}`,
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
      return await getOrderHistories(query, page, perPage);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function getOrder(
  id: number,
): Promise<ResponseWithOnlyData<Order>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/sales/${id}`, {
    method: "GET",
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await getOrder(id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function exportReceiptData(
  id: number,
): Promise<ResponseWithOnlyData<TDocumentDefinitions>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/sales/${id}/export-receipt-data`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${getAccessToken()}`,
      },
      credentials: "include",
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await exportReceiptData(id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
