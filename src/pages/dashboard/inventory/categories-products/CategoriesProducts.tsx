import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { GoPlus } from "react-icons/go";
import { LiaCartPlusSolid } from "react-icons/lia";
import { BiSolidEdit } from "react-icons/bi";

import { Button } from "@/components/atoms/button/Button";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { getPaginatedData } from "@/utils/helpers.utils";
import { Modal } from "@/components/organisms/modal/Modal";
import {
  CategoryForm,
  ChangeProductImageForm,
  ProductForm,
} from "./CategoriesProducts.partials";
import {
  categoryProductModalHeading,
  getCategories,
  getProducts,
} from "./CategoriesProducts.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { useAppDispatch, useAppSelector } from "@/store/index.util";
import { loadCategories } from "@/store/slice/category/category.slice";
import { Headline } from "@/components/atoms/headline/Headline";
import { loadProducts } from "@/store/slice/product/product.slice";
import type { Category, Product } from "@/utils/types.utils";
import { useFetch } from "@/utils/hooks.utils";
import { Pill } from "@/components/atoms/pill/Pill";
import { CgImage } from "react-icons/cg";

export function CategoriesProducts(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.data);
  const productState = useAppSelector((state) => state.product);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  const { isFetching, setIsFetching } = useFetch();

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const {
    state: alertState,
    alertDetails,
    showAlert,
    hideAlert,
    setAlertDetails,
  } = useAlert();

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const result = await getCategories();
        dispatch(loadCategories(result));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getProducts(query, page, perPage);
        dispatch(loadProducts(result));
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProducts();
  }, [dispatch, query, page, perPage, setIsFetching]);

  const handleHideModal = (): void => {
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
    | undefined;

  return (
    <>
      {alertState ? (
        <Alert
          variant={alertDetails?.variant ?? "error"}
          message={alertDetails?.message ?? ""}
          onHide={hideAlert}
        />
      ) : null}
      <PageDescriptor title="Categories and Products" spinnerState={isFetching}>
        <div className="flex items-center gap-2">
          <Button
            el="link"
            to={`${pathname}?action=add-category`}
            variant="primary"
            className="flex! items-center gap-2"
            onClick={() => setSelectedCategory(undefined)}
          >
            <GoPlus />
            <span>Add Category</span>
          </Button>
          <Button
            el="link"
            to={`${pathname}?action=add-product`}
            variant="outline"
            className="flex! items-center gap-2"
            onClick={() => setSelectedProduct(undefined)}
          >
            <LiaCartPlusSolid />
            <span>Add Product</span>
          </Button>
        </div>
      </PageDescriptor>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="basis-full md:basis-3/7 xl:basis-3/8">
          <Headline tag="h5" className="mb-4">
            Categories
          </Headline>
          <DataTable
            columnHeadings={["Name", ""]}
            count={categories.length}
            className="h-[70vh]"
            hidePaginator
          >
            {categories.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <DataTable.Actions>
                    <DataTable.Action
                      onClick={() => handleSelectedCategory(item.id)}
                      className="hover:bg-gray-100 text-gray-500 p-2!"
                    >
                      <BiSolidEdit className="text-xl" />
                      <span>Edit Category</span>
                    </DataTable.Action>
                  </DataTable.Actions>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="basis-full md:basis-4/7 xl:basis-5/8">
          <Headline tag="h5" className="mb-4">
            Products
          </Headline>
          <DataTable
            columnHeadings={["Image", "Name", "Category", "Status", ""]}
            count={productState.count}
            className="max-h-168.75"
          >
            {productState.data.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.imagePath && (
                    <img
                      src={`${import.meta.env.VITE_BASE_API_URL}/${item.imagePath}`}
                      className="w-10 h-10 inline-block object-cover"
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.category.name}</td>
                <td>
                  <Pill
                    text={item.status}
                    variant={item.status === "IN_USE" ? "success" : "danger"}
                  />
                </td>
                <td>
                  <DataTable.Actions>
                    <DataTable.Action
                      onClick={() => {
                        selectPreferredProduct(item.id);
                        navigate(`${pathname}?action=edit-product`);
                      }}
                      className="hover:bg-gray-100 text-gray-500 p-2!"
                    >
                      <BiSolidEdit className="text-xl" />
                      <span>Edit Product</span>
                    </DataTable.Action>
                    <DataTable.Action
                      onClick={() => {
                        selectPreferredProduct(item.id);
                        navigate(`${pathname}?action=change-product-image`);
                      }}
                      className="hover:bg-gray-100 text-gray-500 p-2!"
                    >
                      <CgImage className="text-xl" />
                      <span>Change image</span>
                    </DataTable.Action>
                  </DataTable.Actions>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>
      <Modal
        title={categoryProductModalHeading[activeAction as string]}
        show={Boolean(activeAction)}
        onHide={handleHideModal}
      >
        {activeAction?.includes("category") ? (
          <CategoryForm
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onShowAlert={showAlert}
            selectedCategory={selectedCategory}
          />
        ) : activeAction?.includes("product-image") ? (
          <ChangeProductImageForm
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onShowAlert={showAlert}
            selectedProduct={selectedProduct}
          />
        ) : (
          <ProductForm
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onShowAlert={showAlert}
            selectedProduct={selectedProduct}
            categories={categories}
          />
        )}
      </Modal>
    </>
  );
}
