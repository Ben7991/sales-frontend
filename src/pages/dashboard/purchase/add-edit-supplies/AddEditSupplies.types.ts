import type { ChangeEvent } from "react";

import type {
  PreferredAlertPropsForForm,
  Product,
  PurchaseStatus,
  Supplier,
} from "@/utils/types.utils";

export type Supply = {
  product: Pick<Product, "id" | "name">;
  numberOfBoxes: string;
  comment: string;
};

export type ProductItemListProps = {
  supplies: Array<Supply>;
  onHandleCommentChange: (
    e: ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ) => void;
  onHandleBoxNumberChange: (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => void;
  onRemoveItem: (id: number) => void;
  onAddSupply: (product: Product) => void;
} & Pick<PreferredAlertPropsForForm, "onSetAlertDetails">;

export type PurchaseRow = {
  id: string;
  createdAt: string;
  amount?: number;
  status: PurchaseStatus;
  comment?: string;
  supplier: Pick<Supplier, "name" | "companyName">;
};

export type CreateOrEditSuppliesHeaderProps = {
  title: string;
  onSelectPurchaseToCreate: (id: number) => void;
};

export type SavePurchaseToCreateLaterType = {
  id: number;
  supplier?: Supplier;
  amount: string;
  comment: string;
  supplies: Array<Supply>;
};
