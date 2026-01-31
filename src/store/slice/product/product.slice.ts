import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Product } from "@/utils/types.utils";

type ProductState = {
  count: number;
  data: Array<Product>;
};

const initialState: ProductState = {
  count: 0,
  data: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    loadProducts: (
      state: ProductState,
      action: PayloadAction<ProductState>,
    ) => {
      state.count = action.payload.count;
      state.data = action.payload.data;
    },
    addNewProduct: (state: ProductState, action: PayloadAction<Product>) => {
      state.count = state.count + 1;
      const updatedState = [action.payload, ...state.data];
      if (state.data.length > 10) {
        const deleteCount = 1;
        updatedState.splice(updatedState.length - 1, deleteCount);
      }
      state.data = [...updatedState];
    },
  },
});

export default productSlice.reducer;
export const { loadProducts, addNewProduct } = productSlice.actions;
