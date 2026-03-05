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

export type Paginator = {
  query: string;
  page: number;
  perPage: number;
};

export type PreferredAlertPropsForForm = {
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
  boxPrices: Array<BoxCostPrice>;
};
export type ProductStockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
export type ProductStock = {
  id: number;
  retailUnitPrice: number;
  specialPrice: string;
  totalPieces: number;
  numberOfBoxes: number;
  remainingBoxPieces: number;
  minimumThreshold: number;
  comment: string;
  status: ProductStockStatus;
  product: Product;
  supplier: Supplier;
  wholesalePrices: Array<WholesalePrice>;
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
export type MoneySharing = {
  id: number;
  createdAt: string;
  amount: number;
  supplier: Supplier;
};
export type PurchaseStatus = "SCHEDULE" | "ARRIVED" | "STOCK";
export type WholesalePrice = {
  id: number;
  quantity: number;
  price: number;
};
export type PurchaseSupply = {
  id: number;
  retailUnitPrice?: number;
  totalPieces?: number;
  numberOfBoxes: number;
  comment?: string;
  cost: number;
  product: Product;
  purchaseItemWholesalePrices: Array<WholesalePrice>;
};
export type PurchaseMiscPrice = {
  id: number;
  name: string;
  amount: number;
};
export type Purchase = {
  id: string;
  createdAt: string;
  status: PurchaseStatus;
  comment?: string;
  supplier: Supplier;
  supplies: Array<PurchaseSupply>;
  purchaseMiscPrices: Array<PurchaseMiscPrice>;
};
export type BoxCostPrice = {
  id: number;
  price: number;
  supplier: Supplier;
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
