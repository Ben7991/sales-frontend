import type {
  Category,
  PreferredAlertPropsForForm,
  Product,
} from "@/utils/types.utils";

export type CategoryProductInput = {
  name: string;
};

export type CategoryFormProps = {
  selectedCategory?: Category;
} & PreferredAlertPropsForForm;

export type ProductFormProps = {
  selectedProduct?: Product;
  categories: Array<Category>;
} & PreferredAlertPropsForForm;

export type ChangeProductImageFormProps = Pick<
  ProductFormProps,
  "selectedProduct"
> &
  PreferredAlertPropsForForm;
