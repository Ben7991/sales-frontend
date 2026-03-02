import type { ActionDispatch, Dispatch, SetStateAction } from "react";

import type { NavigateFunction } from "react-router";
import type { StockActionType, StockState } from "./Inventory.reducer";
import type {
  PreferredAlertPropsForForm,
  ProductStock,
} from "@/utils/types.utils";

export type InventoryDataTableProps = {
  stockState: StockState;
  pathname: string;
  onNavigate: NavigateFunction;
  onSelectItem: Dispatch<SetStateAction<ProductStock | undefined>>;
};

export type StockDetailsProps = {
  selectedItem: ProductStock;
  onHidePanel: VoidFunction;
};

export type ChangeThresholdFormProps = {
  onStockDispatch: ActionDispatch<[action: StockActionType]>;
} & StockDetailsProps &
  Pick<PreferredAlertPropsForForm, "onSetAlertDetails">;

export type ChangeThresholdInputs = {
  minimumThreshold: string;
};
