import type {
  BoxCostPrice,
  PreferredAlertPropsForForm,
  Product,
  Supplier,
} from "@/utils/types.utils";
import type { SetStateAction } from "react";

export type Supply = {
  product: Pick<Product, "id" | "name">;
  numberOfBoxes: string;
  comment: string;
  boxPrice: BoxCostPrice;
};

export type ProductItemListProps = {
  supplies: Array<Supply>;
  selectedSupplier?: Supplier;
  onRemoveItem: (id: number) => void;
  onSetSupplies: (value: SetStateAction<Supply[]>) => void;
  onAddSupply: (product: Product, boxPrice: BoxCostPrice) => void;
} & Pick<PreferredAlertPropsForForm, "onSetAlertDetails">;

export type CreateOrEditSuppliesHeaderProps = {
  title: string;
  onSelectPurchaseToCreate: (id: number) => void;
};

export type SavePurchaseToCreateLaterType = {
  id: number;
  supplier?: Supplier;
  comment: string;
  supplies: Array<Supply>;
};
