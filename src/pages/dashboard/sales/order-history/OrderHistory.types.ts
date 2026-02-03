import type { OrderStatus, PaidStatus } from "@/utils/types.utils";

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
  onHideModal: VoidFunction;
};
