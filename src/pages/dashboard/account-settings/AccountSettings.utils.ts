import {
  checkEmail,
  checkUsername,
  getHeaders,
  refreshToken,
} from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import {
  StatusCodes,
  type ResponseWithDataAndMessage,
  type User,
} from "@/utils/types.utils";
import * as yup from "yup";

export const personalInformationSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[a-zA-Z]*$/, { message: "Only letters are allowed" })
    .trim(),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[a-zA-Z]*$/, { message: "Only letters are allowed" })
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
});

export const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required").trim(),
  newPassword: yup
    .string()
    .required("New password is required")
    .matches(/^(?=.*[0-9])[a-zA-Z0-9]+$/, {
      message: "Only letters and numbers are allowed",
    })
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .test({
      test: (value, ctx) => {
        return value === ctx.parent.newPassword;
      },
      message: "Both Confirm Password and New Password do not match each other",
    })
    .trim(),
});

export async function changePersonalInformation(
  data: unknown,
): Promise<ResponseWithDataAndMessage<User>> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/users/change-personal-info`,
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
      return await changePersonalInformation(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}

export async function changePassword(
  data: unknown,
): Promise<{ message: string }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/users/change-password`,
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
      return await changePassword(data);
    }
    throw new Error(result.message);
  } else if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
