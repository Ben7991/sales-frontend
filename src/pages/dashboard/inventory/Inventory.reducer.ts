import type { ProductStock } from "@/utils/types.utils";

export type StockState = {
  count: number;
  data: Array<ProductStock>;
};

export type StockActionType =
  | { type: "load"; payload: StockState }
  | {
      type: "change-threshold";
      payload: { id: number; minimumThreshold: number };
    };

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
  } else if (action.type === "change-threshold") {
    const updatedStocks = [...state.data];
    const existingStockIndex = updatedStocks.findIndex(
      (item) => item.id === action.payload.id,
    );
    updatedStocks[existingStockIndex].minimumThreshold =
      action.payload.minimumThreshold;
    return { ...state, data: updatedStocks };
  }

  throw new Error("Invalid product stock action type");
}
