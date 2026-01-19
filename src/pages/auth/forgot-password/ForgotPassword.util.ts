import { getHeaders } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address",
    })
    .trim(),
});

export async function requestPasswordReset(
  data: unknown,
): Promise<{ message: string }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/auth/forgot-password`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: getHeaders(),
      credentials: "include",
    },
  );
  const result = await response.json();

  if (FAILED_STATUS_CODES.includes(response.status)) {
    throw new Error(result.message);
  }

  return result;
}
