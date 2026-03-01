import * as yup from "yup";

import { makeFirstLetterUppercase } from "@/utils/helpers.utils";
import {
  StatusCodes,
  type Product,
  type ProductStock,
  type ResponseWithDataAndMessage,
  type ResponseWithRecord,
} from "@/utils/types.utils";
import { getAccessToken, getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";

export const categoryProductModalHeading: Record<string, string> = {
  "add-category": makeFirstLetterUppercase("add-category"),
  "edit-category": makeFirstLetterUppercase("edit-category"),
  "add-product": makeFirstLetterUppercase("add-product"),
  "edit-product": makeFirstLetterUppercase("edit-product"),
  "change-product-image": makeFirstLetterUppercase("change-product-image"),
  "import-product": makeFirstLetterUppercase("import-product"),
};

export const categorySchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z ]*$/, {
      message: "Only characters are allowed",
    })
    .trim(),
});

export const productSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z0-9 ]*$/, {
      message: "Only characters and numbers are allowed",
    })
    .trim(),
});

export const costPriceSchema = yup.object({
  price: yup
    .string()
    .required("Price is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid amount")
    .test({
      test: (value) => value !== "0",
      message: "Zero not allowed as price",
    })
    .trim(),
});

export async function getStockViaLiveSearch(
  query: string,
): Promise<ResponseWithRecord<ProductStock>> {
  const searchParams = new URLSearchParams();
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/products/stock-live-search?${searchParams.toString()}`,
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
      return await getStockViaLiveSearch(query);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addProduct(
  data: FormData,
): Promise<ResponseWithDataAndMessage<Product>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/products`, {
    method: "POST",
    body: data,
    headers: {
      authorization: `Bearer ${getAccessToken()}`,
    },
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await addProduct(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function changeImage(
  data: FormData,
  id: number,
): Promise<
  ResponseWithDataAndMessage<{ productId: number; imagePath: string }>
> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/products/${id}/change-image`,
    {
      method: "POST",
      body: data,
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
      return await changeImage(data, id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
