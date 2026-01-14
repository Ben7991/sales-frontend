import * as yup from "yup";
import type { LoginInputs } from "./Login.types";

export const loginSchema = yup.object({
  usernameOrEmail: yup
    .string()
    .required("Username or email field is required")
    .trim(),
  password: yup.string().required("Password field is required").trim(),
  rememberMe: yup.boolean().default(false),
});

export async function login(data: LoginInputs): Promise<void> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (!response.status) {
    throw new Error(result.message);
  }

  return result;
}
