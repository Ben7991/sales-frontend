import * as yup from "yup";

import { makeFirstLetterUppercase } from "@/utils/helpers.utils";
import {
  StatusCodes,
  type Category,
  type Product,
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

export async function getCategories(): Promise<
  Pick<ResponseWithRecord<Category>, "data">
> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/categories`, {
    method: "GET",
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await getCategories();
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addCategory(
  data: unknown,
): Promise<ResponseWithDataAndMessage<Category>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/categories`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await addCategory(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function editCategory(
  data: unknown,
  id: number,
): Promise<ResponseWithDataAndMessage<Category>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/categories/${id}`,
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
      return await editCategory(data, id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function getProducts(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<Product>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/products?${searchParams.toString()}`,
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
      return await getProducts(query, page, perPage);
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

export async function editProduct(
  data: unknown,
  id: number,
): Promise<ResponseWithDataAndMessage<Product>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/products/${id}`,
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
      return await editProduct(data, id);
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
