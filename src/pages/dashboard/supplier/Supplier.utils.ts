import * as yup from "yup";

import { getAccessToken, getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import {
  StatusCodes,
  type PhoneWithID,
  type ResponseWithDataAndMessage,
  type ResponseWithRecord,
  type Supplier,
} from "@/utils/types.utils";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";

export const supplierDataTableColumnHeadings = [
  "Date Added",
  "Name",
  "Email",
  "Company Name",
  "Phones",
  "",
];

export const supplierSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  email: yup
    .string()
    .notRequired()
    .when({
      is: (value?: string) => Boolean(value),
      then: (schema) =>
        schema.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
          message: "Invalid email address",
        }),
    })
    .test({
      test: async (value) => {
        if (!value) return true;

        try {
          return await checkSupplierEmail(value);
        } catch {
          return false;
        }
      },
      message: "Email address already taken",
    })
    .trim(),
  companyName: yup
    .string()
    .notRequired()
    .when({
      is: (value?: string) => Boolean(value),
      then: (schema) =>
        schema.matches(/^[a-zA-Z ]*$/, {
          message: "Only letters and whitespaces are allowed",
        }),
    })
    .trim(),
});

export const supplierPhoneSchema = yup.object({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]*$/, {
      message: "Only digits are allowed",
    })
    .trim(),
});

export const supplierModalHeading: Record<string, string> = {
  add: `${makeFirstLetterUppercase("add")} Supplier`,
  edit: `${makeFirstLetterUppercase("edit")} Supplier`,
  "add-phone": `${makeFirstLetterUppercase("add-phone")} for Supplier`,
  "edit-phone": `${makeFirstLetterUppercase("edit-phone")} for Supplier`,
  "delete-phone": `${makeFirstLetterUppercase("delete-phone")} for Supplier`,
  import: `${makeFirstLetterUppercase("import")} Suppliers`,
};

export async function getSuppliers(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<Supplier>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers?${searchParams.toString()}`,
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
      return await getSuppliers(query, page, perPage);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addSupplier(
  data: unknown,
): Promise<ResponseWithDataAndMessage<Supplier>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/suppliers`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await addSupplier(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function checkSupplierEmail(email: string): Promise<boolean> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers/check-email`,
    {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: getHeaders(true),
      credentials: "include",
    },
  );

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await checkSupplierEmail(email);
    }
    return false;
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    return false;
  }

  return true;
}

export async function editSupplier(
  data: unknown,
  id: number,
): Promise<ResponseWithDataAndMessage<Supplier>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers/${id}`,
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
      return await editSupplier(data, id);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addSupplierPhone(
  data: unknown,
  supplierId: number,
): Promise<ResponseWithDataAndMessage<PhoneWithID>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers/${supplierId}/phone`,
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
      return await addSupplierPhone(data, supplierId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function editSupplierPhone(
  data: unknown,
  supplierPhoneId: number,
  supplierId: number,
): Promise<ResponseWithDataAndMessage<PhoneWithID>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers/${supplierId}/phone/${supplierPhoneId}`,
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
      return await editSupplierPhone(data, supplierPhoneId, supplierId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function removeSupplierPhone(
  phoneId: number,
  supplierId: number,
): Promise<ResponseWithDataAndMessage<PhoneWithID>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers/${supplierId}/phone/${phoneId}`,
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
      return await removeSupplierPhone(phoneId, supplierId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function importSuppliers(
  formData: FormData,
): Promise<{ message: string; data: Array<Supplier> }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/suppliers/import`,
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
      return await importSuppliers(formData);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
