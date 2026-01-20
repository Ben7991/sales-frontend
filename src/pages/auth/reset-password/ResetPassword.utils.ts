import { getHeaders } from "@/utils/auth.util";
import { FAILED_STATUS_CODES } from "@/utils/constants.utils";
import * as yup from "yup";

export const resetPasswwordSchema = yup.object({
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

export async function resetPasswordWithToken(
  data: unknown,
  token: string,
): Promise<{ message: string }> {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/auth/reset-password?token=${token}`,
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
