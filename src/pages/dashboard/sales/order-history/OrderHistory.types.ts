import type {
  OrderStatus,
  PaidStatus,
  PreferredAlertPropsForForm,
} from "@/utils/types.utils";
import type { Dispatch, SetStateAction } from "react";

export type OrderHistoryState = {
  count: number;
  data: Array<OrderHistoryItem>;
};

export type OrderHistoryItem = {
  id: number;
  createdAt: string;
  customer: string;
  amountPaid: number;
  orderStatus: OrderStatus;
  paidStatus: PaidStatus;
  orderTotal: number;
};

export type OrderDetailsProps = {
  showOffCanvas: boolean;
  selectedOrderHistory: OrderHistoryItem;
} & PreferredAlertPropsForForm;

export type AddPaymentData = {
  id: number;
  paidStatus: PaidStatus;
  totalAmountPaid: number;
  orderTotal: number;
};

export type OrderPaymentFormProps = {
  onSetOrderHistory: Dispatch<SetStateAction<OrderHistoryState>>;
} & Pick<OrderDetailsProps, "selectedOrderHistory"> &
  Omit<PreferredAlertPropsForForm, "onHideModal">;

export type ChangeOrderStatusProps = {
  onSetOrderHistory: Dispatch<SetStateAction<OrderHistoryState>>;
} & Pick<OrderDetailsProps, "selectedOrderHistory"> &
  PreferredAlertPropsForForm;
