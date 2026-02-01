import type { ProductStock } from "@/utils/types.utils";

type StockState = {
  count: number;
  data: Array<ProductStock>;
};

type StockActionType = { type: "load"; payload: StockState };

export const initialAvailableStockState = {
  count: 0,
  data: [],
} satisfies StockState;

export function availableStockReducer(
  state: StockState,
  action: StockActionType,
): StockState {
  if (action.type === "load") {
    return { ...state, ...action.payload };
  }

  throw new Error("Invalid product stock action type");
}
