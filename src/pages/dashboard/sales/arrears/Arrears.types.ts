export const arrearsColumnHeadings = [
  "Customer",
  "Total Orders",
  "Total Amount",
  "Last Date Paid",
];

export type ArrearsRow = {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalAmountToPay: number;
  lastDatePaid: string;
};

export type ArrearsOrder = {
  orderId: string;
  amountPaid: number;
  orderTotal: number;
  outstandingAmount: number;
};

export type ArrearState = {
  count: number;
  data: Array<ArrearsRow>;
};

export type ArrearsDetailProps = {
  showOffCanvas: boolean;
  selectedItem: ArrearsRow;
  onHideModal: VoidFunction;
};
