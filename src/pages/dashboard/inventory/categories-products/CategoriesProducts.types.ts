import type { ProductState } from "@/store/slice/product/product.slice";
import type {
  BoxCostPrice,
  Category,
  PreferredAlertPropsForForm,
  Product,
} from "@/utils/types.utils";
import type { NavigateFunction } from "react-router";

export type CategoryProductInput = {
  name: string;
};

export type ProductRow = {
  categoryName: string;
  totalBoxPrices: number;
} & Pick<Product, "id" | "imagePath" | "name" | "status">;

export type CategoryFormProps = {
  selectedCategory?: Category;
} & PreferredAlertPropsForForm;

export type ProductFormProps = {
  selectedProduct?: ProductRow;
  categories: Array<Category>;
} & PreferredAlertPropsForForm;

export type ChangeProductImageFormProps = Pick<
  ProductFormProps,
  "selectedProduct"
> &
  PreferredAlertPropsForForm;

export type CategoryAndProductHeaderProps = {
  pathname: string;
  isFetching: boolean;
  onResetSelectedCategory: VoidFunction;
  onResetSelectedProduct: VoidFunction;
};

export type CategoryDataTableProps = {
  categories: Array<Category>;
  onSelectItem: (id: number) => void;
};

export type ProductDataTableProps = {
  productState: ProductState;
  pathname: string;
  onNavigate: NavigateFunction;
} & Pick<CategoryDataTableProps, "onSelectItem">;

export type CostPriceManagerProps = Pick<
  CostPriceFormProps,
  "onSetAlertDetails" | "selectedProduct"
>;

export type CostPriceFormProps = {
  selectedPrice?: BoxCostPrice;
  selectedProduct: ProductRow;
  onResetSelectedPrice: VoidFunction;
  onUpdateCostPrices: (data: BoxCostPrice, id?: number) => void;
} & Pick<PreferredAlertPropsForForm, "onSetAlertDetails">;
