import type { ActionDispatch } from "react";
import type { Maybe } from "yup";

import type { SupplierActionType } from "./Supplier.reducer";

import type {
  ActiveTabForPhoneForm,
  PhoneWithID,
  PreferredAlertPropsForForm,
  Supplier,
} from "@/utils/types.utils";

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
} & PreferredAlertPropsForForm;

export type SupplierPhoneFormProps = {
  activeTab: ActiveTabForPhoneForm;
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
