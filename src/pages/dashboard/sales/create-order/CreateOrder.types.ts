import type { ChangeEvent } from "react";

import type { Customer, OrderSale, ProductStock } from "@/utils/types.utils";

export type OrderItemToCreate = {
  id: number;
  productStock: ProductStock;
  quantity: string;
  price: number;
  total: number;
  comment: string;
};

export type OrderItemListProps = {
  productStocks: Array<OrderItemToCreate>;
  onHandleCommentChange: (
    e: ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => void;
  onHandleQuantityChange: (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => void;
  onRemoveItem: (id: number) => void;
};

export type OrderToCreate = {
  productStocks: Array<OrderItemToCreate>;
  customer?: Customer;
  orderSale?: OrderSale;
  id: number;
};

export type CreateOrEditOrderHeaderProps = {
  onSelectOrderToCreate: (item: OrderToCreate) => void;
};
