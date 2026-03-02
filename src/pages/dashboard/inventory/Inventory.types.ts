import type { NavigateFunction } from "react-router";
import type { StockState } from "./Inventory.reducer";

export type InventoryDataTableProps = {
  stockState: StockState;
  pathname: string;
  onNavigate: NavigateFunction;
};
