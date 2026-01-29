import type { ActionDispatch } from "react";

import type { User, PreferredAlertPropsForForm } from "@/utils/types.utils";
import type { UserActionType } from "./Employee.reducer";

export type EmployeeInputs = {
  name: string;
  email: string;
  username: string;
};

export type EmployeeFormProps = {
  perPage: number;
  selectedEmployee?: User;
  onResetSelectedEmployee: VoidFunction;
  onEmployeeDispatch: ActionDispatch<[action: UserActionType]>;
} & PreferredAlertPropsForForm;

export type EmployeeSubHeaderProps = {
  isFetching: boolean;
  pathname: string;
  perPage: number;
  page: number;
  onResetSelectedEmployee: VoidFunction;
};
