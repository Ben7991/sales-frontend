import type { ProductStock } from "@/utils/types.utils";

export type StockState = {
  count: number;
  data: Array<ProductStock>;
};

type StockActionType = { type: "load"; payload: StockState };

export const initialStockState = {
  count: 0,
  data: [],
} satisfies StockState;

export function inventoryReducer(
  state: StockState,
  action: StockActionType,
): StockState {
  if (action.type === "load") {
    return { ...state, ...action.payload };
  }

  throw new Error("Invalid product stock action type");
}
