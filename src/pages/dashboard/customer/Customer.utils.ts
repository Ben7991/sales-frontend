import * as yup from "yup";

import {
  StatusCodes,
  type Customer,
  type ResponseWithRecord,
} from "@/utils/types.utils";
import { getAccessToken, refreshToken } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import {
  getSearchParamsWithQuery,
  makeFirstLetterUppercase,
} from "@/utils/helpers.utils";
import { get } from "@/utils/http.utils";

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

export async function getCustomerViaLiveSearch(
  query: string,
): Promise<ResponseWithRecord<Customer>> {
  return get<ResponseWithRecord<Customer>>(
    `customer/live-search?${getSearchParamsWithQuery(query).toString()}`,
  );
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
