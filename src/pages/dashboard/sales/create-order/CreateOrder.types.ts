import type { ChangeEvent } from "react";

import type { Customer, OrderSale, ProductStock } from "@/utils/types.utils";

export type DropdownWithSearchProps<T> = {
  placeholder: string;
  selectedItem?: T;
  onSetSelectedItem: (item?: T) => void;
  onGetValue: (item?: T) => string;
  onGetItems: (
    query: string,
    page: number,
    perPage: number,
  ) => Promise<{ count: number; data: Array<T> }>;
  children?: React.ReactNode;
};

export type OrderItemToCreate = {
  id: number;
  item: ProductStock;
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

export type CreateOrEditHeaderProps = {
  onSelectOrderToCreate: (item: OrderToCreate) => void;
};
