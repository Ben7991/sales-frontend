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

export type Role = "ADMIN" | "SALES_PERSON" | "PROCUREMENT_OFFICER";
export type AvailabilityStatus = "ACTIVE" | "IN_ACTIVE";
export type UserStatus = "ACTIVE" | "FIRED" | "QUIT";
export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  status: UserStatus;
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
export type Category = {
  id: number;
  name: string;
};
export type ProductStatus = "IN_USE" | "DISCONTINUED";
export type Product = {
  id: number;
  name: string;
  imagePath?: string;
  status: ProductStatus;
  category: Category;
};
export type ProductStockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
export type ProductStock = {
  id: number;
  retailUnitPrice: string;
  wholesaleUnitPrice: string;
  specialPrice: string;
  wholesalePrice: string;
  totalPieces: number;
  numberOfBoxes: number;
  minimumThreshold: number;
  description: string;
  status: ProductStockStatus;
  product: Product;
  supplier: Supplier;
};
export type OrderStatus =
  | "OPEN"
  | "DEEMED_SATISFIED"
  | "DELIVERED"
  | "CANCELLED";
export type PaidStatus = "PAID" | "OUTSTANDING";
export type OrderSale = "WHOLESALE" | "RETAIL";
export type OrderItem = {
  id: number;
  productStock: ProductStock;
  quantity: number;
  amount: number;
  amountPaid: number;
  comment: string;
};
export type PaymentMode = "CASH" | "MOBILE_MONEY" | "BANK_TRANSFER" | "CHEQUE";
export type OrderPayment = {
  id: number;
  createdAt: string;
  amount: string;
  paymentMode: PaymentMode;
};
export type Order = {
  id: number;
  orderDate: string;
  orderSale: OrderSale;
  paidStatus: PaidStatus;
  amountPaid: number;
  orderTotal: number;
  comment: string;
  orderItems: Array<OrderItem>;
  orderPayments: Array<OrderPayment>;
  customer: Customer;
  orderStatus: OrderStatus;
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
