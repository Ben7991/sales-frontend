import * as yup from "yup";

export const orderHistoryColumnHeadings = [
  "Order Number",
  "Date Created",
  "Customer",
  "Order Total",
  "Amount Paid",
  "Order Status",
  "Paid Status",
  "",
];

export const ORDER_STATUSES = [
  "Open",
  "Deemed Satisfied",
  "Cancelled",
  "Delivered",
];

export const orderPaymentSchema = yup.object({
  amount: yup
    .string()
    .required("Amount is required")
    .matches(/^[0-9]+(\.[0-9]{2})*$/, {
      message: "Must be a valid amount figure",
    })
    .trim(),
});
