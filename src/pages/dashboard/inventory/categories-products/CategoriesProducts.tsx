import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import {
  getPaginatedData,
  getSearchParamsForPaginator,
} from "@/utils/helpers.utils";
import { Modal } from "@/components/organisms/modal/Modal";
import {
  CategoryAndProductHeader,
  CategoryDataTable,
  CategoryForm,
  ChangeProductImageForm,
  CostPriceManager,
  ProductDataTable,
  ProductForm,
} from "./CategoriesProducts.partials";
import { categoryProductModalHeading } from "./CategoriesProducts.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import { useAppDispatch, useAppSelector } from "@/store/index.util";
import { loadCategories } from "@/store/slice/category/category.slice";
import { loadProducts } from "@/store/slice/product/product.slice";
import type { Category, ResponseWithRecord } from "@/utils/types.utils";
import { useFetch } from "@/utils/hooks.utils";
import { get } from "@/utils/http.utils";
import { OffCanvas } from "@/components/organisms/offcanvas/OffCanvas";
import type { ProductRow } from "./CategoriesProducts.types";

export default function CategoriesProducts(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.data);
  const productState = useAppSelector((state) => state.product);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  const { isFetching, setIsFetching } = useFetch();

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedProduct, setSelectedProduct] = useState<ProductRow>();

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const result =
          await get<Pick<ResponseWithRecord<Category>, "data">>("categories");
        dispatch(loadCategories(result));
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, [dispatch, setAlertDetails]);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const searchParams = getSearchParamsForPaginator(query, page, perPage);
        const result = await get<ResponseWithRecord<ProductRow>>(
          `products?${searchParams.toString()}`,
        );
        dispatch(loadProducts(result));
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch products", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProducts();
  }, [dispatch, query, page, perPage, setIsFetching, setAlertDetails]);

  const hideModal = (): void => {
    navigate(pathname);
  };

  const handleSelectedCategory = (id: number): void => {
    const existingCategory = categories.find((item) => item.id === id);

    if (!existingCategory) {
      return;
    }

    setSelectedCategory(existingCategory);
    navigate(`${pathname}?action=edit-category`);
  };

  const selectPreferredProduct = useCallback(
    (id: number): void => {
      const existingProduct = productState.data.find((item) => item.id === id);

      if (!existingProduct) {
        return;
      }

      setSelectedProduct(existingProduct);
    },
    [productState.data],
  );

  const activeAction = searchParams.get("action") as
    | "add-category"
    | "edit-category"
    | "add-product"
    | "edit-product"
    | "change-product-image"
    | "cost-prices"
    | undefined;

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <CategoryAndProductHeader
        isFetching={isFetching}
        pathname={pathname}
        onResetSelectedCategory={() => setSelectedCategory(undefined)}
        onResetSelectedProduct={() => setSelectedProduct(undefined)}
      />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <CategoryDataTable
          categories={categories}
          onSelectItem={handleSelectedCategory}
        />
        <ProductDataTable
          productState={productState}
          onNavigate={navigate}
          onSelectItem={selectPreferredProduct}
          pathname={pathname}
        />
      </div>
      {activeAction === "cost-prices" && selectedProduct ? (
        <OffCanvas
          title="Cost Prices"
          show={activeAction === "cost-prices"}
          onHide={hideModal}
        >
          <CostPriceManager
            selectedProduct={selectedProduct}
            onSetAlertDetails={setAlertDetails}
          />
        </OffCanvas>
      ) : (
        <Modal
          title={categoryProductModalHeading[activeAction as string]}
          show={Boolean(activeAction)}
          onHide={hideModal}
        >
          {activeAction?.includes("category") ? (
            <CategoryForm
              onHideModal={hideModal}
              onSetAlertDetails={setAlertDetails}
              selectedCategory={selectedCategory}
            />
          ) : activeAction?.includes("product-image") ? (
            <ChangeProductImageForm
              onHideModal={hideModal}
              onSetAlertDetails={setAlertDetails}
              selectedProduct={selectedProduct}
            />
          ) : (
            <ProductForm
              onHideModal={hideModal}
              onSetAlertDetails={setAlertDetails}
              selectedProduct={selectedProduct}
              categories={categories}
            />
          )}
        </Modal>
      )}
    </>
  );
}
