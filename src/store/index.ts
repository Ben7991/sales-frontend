import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slice/auth/auth.slice";
import categoryReducer from "./slice/category/category.slice";
import productReducer from "./slice/product/product.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
  },
});
