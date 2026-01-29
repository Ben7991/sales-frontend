import * as yup from "yup";

import {
  checkEmail,
  checkUsername,
  getHeaders,
  refreshToken,
} from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";
import {
  StatusCodes,
  type Employee,
  type ResponseWithDataAndMessage,
  type ResponseWithRecord,
} from "@/utils/types.utils";

export const employeeDataTableColumnHeadings = [
  "Date Added",
  "Name",
  "Email",
  "Username",
  "Role",
  "Status",
  "",
];

export const employeeSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address",
    })
    .test({
      test: async (value): Promise<boolean> => {
        try {
          await checkEmail(value);
          return true;
        } catch {
          return false;
        }
      },
      message: "Email already taken",
    })
    .trim(),
  username: yup
    .string()
    .required("Username is required")
    .matches(/^[a-z0-9]*[0-9]{1}$/, {
      message:
        "Should start and contain only lower letters but end with at least a number",
    })
    .test({
      test: async (value): Promise<boolean> => {
        try {
          await checkUsername(value);
          return true;
        } catch {
          return false;
        }
      },
      message: "Username already taken",
    })
    .trim(),
});

export async function getEmployees(
  query: string,
  page: number,
  perPage: number,
): Promise<ResponseWithRecord<Employee>> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", (page - 1).toString());
  searchParams.set("perPage", perPage.toString());
  searchParams.set("q", query.toString());

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/users?${searchParams.toString()}`,
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
      return await getEmployees(query, page, perPage);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function addEmployee(
  data: unknown,
): Promise<ResponseWithDataAndMessage<Employee>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(true),
    credentials: "include",
  });
  const result = await response.json();

  if (response.status === StatusCodes.UN_AUTHORIZED) {
    const isRefreshed = await refreshToken();
    if (isRefreshed) {
      return await addEmployee(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function editEmployee(
  data: unknown,
  employeeId: number,
): Promise<ResponseWithDataAndMessage<Employee>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/users/${employeeId}`,
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
      return await editEmployee(data, employeeId);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export function formatRole(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((item) => makeFirstLetterUppercase(item))
    .join(" ");
}
