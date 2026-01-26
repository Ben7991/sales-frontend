import type { ActionDispatch, Dispatch, SetStateAction } from "react";
import type { Maybe } from "yup";

import type { SupplierActionType } from "./Supplier.reducer";
import type { AlertProps } from "@/components/molecules/alert/Alert.types";
import type { PhoneWithID, Supplier } from "@/utils/types.utils";

export type SupplierInputs = {
  name: string;
  email?: Maybe<string | undefined>;
  companyName?: Maybe<string | undefined>;
};

export type SupplierPhoneInput = {
  phone: string;
};

export type SupplierFormProps = {
  perPage: number;
  selectedSupplier?: Supplier;
  onResetSelectedSupplier: VoidFunction;
  onSupplierDispatch: ActionDispatch<[action: SupplierActionType]>;
  onShowAlert: VoidFunction;
  onHideModal: VoidFunction;
  onSetAlertDetails: Dispatch<
    SetStateAction<Omit<AlertProps, "onHide" | "state"> | undefined>
  >;
};

export type ActiveTabForSupplierPhoneForm =
  | "edit-phone"
  | "add-phone"
  | "delete-phone";

export type SupplierPhoneFormProps = {
  activeTab: ActiveTabForSupplierPhoneForm;
  selectedSupplierPhone?: PhoneWithID;
  onResetSelectedSupplierPhone: VoidFunction;
} & Pick<
  SupplierFormProps,
  | "selectedSupplier"
  | "onShowAlert"
  | "onSetAlertDetails"
  | "onHideModal"
  | "onSupplierDispatch"
>;

export type SupplierImportProps = {
  perPage: number;
} & Pick<SupplierFormProps, "onSupplierDispatch">;
