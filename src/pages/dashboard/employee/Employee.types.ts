import type { ActionDispatch } from "react";

import type { Employee, PreferredAlertPropsForForm } from "@/utils/types.utils";
import type { EmployeeActionType } from "./Employee.reducer";

export type EmployeeInputs = {
  name: string;
  email: string;
  username: string;
};

export type EmployeeFormProps = {
  perPage: number;
  selectedEmployee?: Employee;
  onResetSelectedEmploye: VoidFunction;
  onEmployeeDispatch: ActionDispatch<[action: EmployeeActionType]>;
} & PreferredAlertPropsForForm;

export type EmployeeSubHeaderProps = {
  isFetching: boolean;
  pathname: string;
  perPage: number;
  page: number;
  onResetSelectedEmployee: VoidFunction;
};
