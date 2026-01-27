import type { ActionDispatch } from "react";
import type { Maybe } from "yup";

import type {
  ActiveTabForPhoneForm,
  Customer,
  PhoneWithID,
  PreferredAlertPropsForForm,
} from "@/utils/types.utils";
import type { CustomerActionType } from "./Customer.reducer";

export type CustomerInputs = {
  name: string;
  address?: Maybe<string | undefined>;
};

export type CustomerPhoneInput = {
  phone: string;
};

export type CustomerFormProps = {
  perPage: number;
  selectedCustomer?: Customer;
  onResetSelectedCustomer: VoidFunction;
  onCustomerDispatch: ActionDispatch<[action: CustomerActionType]>;
} & PreferredAlertPropsForForm;

export type CustomerPhoneFormProps = {
  activeTab: ActiveTabForPhoneForm;
  selectedCustomerPhone?: PhoneWithID;
  onResetSelectedCustomerPhone: VoidFunction;
} & Pick<CustomerFormProps, "selectedCustomer" | "onCustomerDispatch"> &
  PreferredAlertPropsForForm;

export type CustomerImportProps = Pick<
  CustomerFormProps,
  "perPage" | "onCustomerDispatch"
>;
