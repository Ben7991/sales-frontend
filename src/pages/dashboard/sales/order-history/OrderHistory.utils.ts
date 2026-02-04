import type { TDocumentDefinitions } from "pdfmake/interfaces";
import * as yup from "yup";

import {
  StatusCodes,
  type Order,
  type ResponseWithDataAndMessage,
  type ResponseWithOnlyData,
  type ResponseWithRecord,
} from "@/utils/types.utils";
import type { AddPaymentData, OrderHistoryItem } from "./OrderHistory.types";
import { getAccessToken, getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";

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

export const ORDER_STATUSES = [
  "Open",
  "Deemed Satisfied",
  "Cancelled",
  "Delivered",
];

export const orderPaymentSchema = yup.object({
  amount: yup
    .string()
    .required("Amount is required")
    .matches(/^[0-9]+(\.[0-9]{2})*$/, {
      message: "Must be a valid amount figure",
    })
    .trim(),
});

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

export async function addPayment(
  data: unknown,
  id: number,
): Promise<ResponseWithDataAndMessage<AddPaymentData>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/sales/${id}/add-payment`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: getHeaders(true),
      credentials: "include",
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await addPayment(data, id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function changeOrderStatus(
  data: unknown,
  id: number,
): Promise<{ message: string }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/sales/${id}/change-status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: getHeaders(true),
      credentials: "include",
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await changeOrderStatus(data, id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
