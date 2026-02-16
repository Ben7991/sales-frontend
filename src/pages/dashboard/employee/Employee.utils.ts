import * as yup from "yup";

import { checkEmail, checkUsername } from "@/utils/auth.util";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";
import type { Role } from "@/utils/types.utils";

export const employeeDataTableColumnHeadings = [
  "Date Added",
  "Name",
  "Email",
  "Username",
  "Role",
  "Status",
  "",
];

const nameValidation = {
  name: yup.string().required("Name is required").trim(),
};

export const updateEmployeeSchema = yup.object(nameValidation);
export const createEmployeeSchema = yup.object({
  ...nameValidation,
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address",
    })
    .test({
      test: async (value): Promise<boolean> => {
        if (!value) {
          return Promise.resolve(true);
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
          return Promise.resolve(true);
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
});

/**
 * This function properly formats roles to ensure that
 * all underscores are removed before being displayed to the user
 * @param role
 * @returns {string}
 */
export function formatRole(role: Role): string {
  return role
    .toLowerCase()
    .split("_")
    .map((item) => makeFirstLetterUppercase(item))
    .join(" ");
}

/**
 * In-order to suit the backend required payload for the role field
 * when either creating an employee or editing, this function ensures the right
 * role string is returned.
 * @param role The role displayed in the user interface
 * @returns {Role}
 */
export function getUserRole(role: string): Role {
  return role.startsWith("Procurement")
    ? "PROCUREMENT_OFFICER"
    : "SALES_PERSON";
}
