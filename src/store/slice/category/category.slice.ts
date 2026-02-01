import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Category } from "@/utils/types.utils";

type CategoryState = {
  data: Array<Category>;
};

const initialState: CategoryState = {
  data: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    loadCategories: (
      state: CategoryState,
      action: PayloadAction<CategoryState>,
    ) => {
      state.data = action.payload.data;
    },
    addNewCategory: (state: CategoryState, action: PayloadAction<Category>) => {
      const categories = [action.payload, ...state.data];
      state.data = categories;
    },
    updateCategory: (state: CategoryState, action: PayloadAction<Category>) => {
      const updatedCategories = [...state.data];
      const existingCategoryIndex = updatedCategories.findIndex(
        (item) => item.id === action.payload.id,
      );
      const updatedCategory = updatedCategories[existingCategoryIndex];
      updatedCategory.name = action.payload.name;
      const deleteCount = 1;
      updatedCategories.splice(
        existingCategoryIndex,
        deleteCount,
        updatedCategory,
      );
      state.data = updatedCategories;
    },
  },
});

export default categorySlice.reducer;
export const { addNewCategory, updateCategory, loadCategories } =
  categorySlice.actions;
