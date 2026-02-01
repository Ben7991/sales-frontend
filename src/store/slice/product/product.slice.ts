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
      const updatedData = [action.payload, ...state.data];
      if (state.data.length > 10) {
        const deleteCount = 1;
        updatedData.splice(updatedData.length - 1, deleteCount);
      }
      state.data = [...updatedData];
    },
    updateProduct: (state: ProductState, action: PayloadAction<Product>) => {
      const updatedData = [...state.data];
      const existingProductIndex = updatedData.findIndex(
        (item) => item.id === action.payload.id,
      );
      const deleteCount = 1;
      updatedData.splice(existingProductIndex, deleteCount, action.payload);
      state.data = [...updatedData];
    },
    updateProductImage: (
      state: ProductState,
      action: PayloadAction<{ id: number; imagePath: string }>,
    ) => {
      const updatedData = [...state.data];
      const existingProductIndex = updatedData.findIndex(
        (item) => item.id === action.payload.id,
      );
      updatedData[existingProductIndex].imagePath = action.payload.imagePath;
      state.data = [...updatedData];
    },
  },
});

export default productSlice.reducer;
export const {
  loadProducts,
  addNewProduct,
  updateProduct,
  updateProductImage,
} = productSlice.actions;
