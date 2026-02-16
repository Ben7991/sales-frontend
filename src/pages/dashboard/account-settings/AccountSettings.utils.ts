import { checkEmail, checkUsername } from "@/utils/auth.util";
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
        if (!value) {
          return true;
        }

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
        if (!value) {
          return true;
        }

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
      message: "Passwords do not match each other",
    })
    .trim(),
});
