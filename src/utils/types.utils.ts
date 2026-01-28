import type { Dispatch, SetStateAction } from "react";

import type { AlertProps } from "@/components/molecules/alert/Alert.types";

export type ResponseWithDataAndMessage<T> = {
  message: string;
  data: T;
};

export type ResponseWithOnlyData<T> = {
  data: T;
};

export type ResponseWithRecord<T> = {
  count: number;
  data: Array<T>;
};

export type PreferredAlertPropsForForm = {
  onShowAlert: VoidFunction;
  onHideModal: VoidFunction;
  onSetAlertDetails: Dispatch<
    SetStateAction<Omit<AlertProps, "onHide" | "state"> | undefined>
  >;
};
export type ActiveTabForPhoneForm = "edit-phone" | "add-phone" | "delete-phone";

export type DataWithID = { id: number; data: string };
export type PhoneWithID = { id: number; phone: string };

export type Role = "ADMIN" | "SALES_PERSON" | "PROCUREMENT_MANAGER";
export type AccountStatus = "ACTIVE" | "SUSPENDED";
export type AvailabilityStatus = "ACTIVE" | "IN_ACTIVE";
export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  status: AccountStatus;
  setPassword: boolean;
};
export type Supplier = {
  id: number;
  createdAt: string;
  name: string;
  companyName: string;
  email: string;
  status: AvailabilityStatus;
  supplierPhones: Array<PhoneWithID>;
};
export type Customer = {
  id: number;
  createdAt: string;
  name: string;
  address: string;
  customerPhones: Array<PhoneWithID>;
};
export type UserStatus = "ACTIVE" | "FIRED" | "QUIT";
export type Employee = {
  id: number;
  createdAt: string;
  name: string;
  username: string;
  email: string;
  status: UserStatus;
  role: Role;
};

export const StatusCodes = {
  CREATED: 201,
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UN_AUTHORIZED: 401,
  FORBIDDEN: 403,
  VALIDATION_FAILED: 422,
  SERVER_ERROR: 500,
} as const;

export type AuthState = "loading" | "authenticated" | "not-authenticated";
