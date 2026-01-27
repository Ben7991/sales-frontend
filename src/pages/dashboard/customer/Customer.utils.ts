import * as yup from "yup";

import {
  StatusCodes,
  type Customer,
  type PhoneWithID,
  type ResponseWithDataAndMessage,
  type ResponseWithRecord,
} from "@/utils/types.utils";
import { getAccessToken, getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";

export const customerDataTableColumnHeadings = [
  "Date Added",
  "Name",
  "Address",
  "Phones",
  "",
];

export const customerSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  address: yup.string().notRequired().trim(),
});

export const customerPhoneSchema = yup.object({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]*$/, {
      message: "Only digits are allowed",
    })
    .trim(),
});

export const customerModalHeading: Record<string, string> = {
  add: `${makeFirstLetterUppercase("add")} Customer`,
  edit: `${makeFirstLetterUppercase("edit")} Customer`,
  "add-phone": `${makeFirstLetterUppercase("add-phone")} for Customer`,
  "edit-phone": `${makeFirstLetterUppercase("edit-phone")} for Customer`,
  "delete-phone": `${makeFirstLetterUppercase("delete-phone")} for Customer`,
  import: `${makeFirstLetterUppercase("import")} Customers`,
};

export async function getCustomers(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<Customer>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/customers?${searchParams.toString()}`,
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
      return await getCustomers(query, page, perPage);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addCustomer(
  data: unknown,
): Promise<ResponseWithDataAndMessage<Customer>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/customers`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await addCustomer(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function editCustomer(
  data: unknown,
  id: number,
): Promise<ResponseWithDataAndMessage<Customer>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/customers/${id}`,
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
      return await editCustomer(data, id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addCustomerPhone(
  data: unknown,
  customerId: number,
): Promise<ResponseWithDataAndMessage<PhoneWithID>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/customers/${customerId}/phone`,
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
      return await addCustomerPhone(data, customerId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function editCustomerPhone(
  data: unknown,
  phoneId: number,
  customerId: number,
): Promise<ResponseWithDataAndMessage<PhoneWithID>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/customers/${customerId}/phone/${phoneId}`,
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
      return await editCustomerPhone(data, phoneId, customerId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function removeCustomerPhone(
  phoneId: number,
  customerId: number,
): Promise<ResponseWithDataAndMessage<PhoneWithID>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/customers/${customerId}/phone/${phoneId}`,
    {
      method: "DELETE",
      headers: getHeaders(true),
      credentials: "include",
    },
  );
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await removeCustomerPhone(phoneId, customerId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function importCustomers(
  formData: FormData,
): Promise<{ message: string; data: Array<Customer> }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/customers/import`,
    {
      method: "POST",
      body: formData,
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
      return await importCustomers(formData);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
