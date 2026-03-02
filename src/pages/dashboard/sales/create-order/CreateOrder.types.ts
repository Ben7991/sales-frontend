import type { ChangeEvent, SetStateAction } from "react";

import type {
  Customer,
  OrderSale,
  ProductStock,
  WholesalePrice,
} from "@/utils/types.utils";

export type OrderItemToCreate = {
  id: number;
  productStock: ProductStock;
  quantity: string;
  price: number;
  total: number;
  comment: string;
  multiplier?: string;
  wholesalePrice?: WholesalePrice;
};

export type OrderItemListProps = {
  orderSale: OrderSale;
  productStocks: Array<OrderItemToCreate>;
  onSetProductStocks: (value: SetStateAction<OrderItemToCreate[]>) => void;
  onRemoveItem: (id: number) => void;
};

export type RetailItemsTableProps = {
  onHandleCommentChange: (
    e: ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => void;
  onHandleQuantityChange: (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => void;
} & Pick<OrderItemListProps, "onRemoveItem" | "productStocks">;

export type WholesaleItemsTableProps = {
  onHandleCostChange: (e: ChangeEvent<HTMLInputElement>, id: number) => void;
  onHandleMultiplierChange: (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => void;
  onSelectWholePrice: (item: WholesalePrice, id: number) => void;
} & Omit<RetailItemsTableProps, "onHandleQuantityChange">;

export type WholesaleTableRowProps = {
  data: OrderItemToCreate;
} & Omit<WholesaleItemsTableProps, "productStocks">;

export type OrderToCreate = {
  productStocks: Array<OrderItemToCreate>;
  customer?: Customer;
  orderSale: OrderSale;
  id: number;
};

export type CreateOrEditOrderHeaderProps = {
  title: string;
  onSelectOrderToCreate: (item: OrderToCreate) => void;
};
