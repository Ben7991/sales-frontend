import * as yup from "yup";

import { getAccessToken, getHeaders, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import { StatusCodes, type Supplier } from "@/utils/types.utils";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";

export const supplierDataTableColumnHeadings = [
  "Date Added",
  "Name",
  "Company Name",
  "Phones",
];

export const supplierSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
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
