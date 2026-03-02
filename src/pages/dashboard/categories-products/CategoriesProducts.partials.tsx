import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosSave } from "react-icons/io";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import {
  addProduct,
  categorySchema,
  changeImage,
  costPriceSchema,
  productSchema,
} from "./CategoriesProducts.utils";
import type {
  CategoryAndProductHeaderProps,
  CategoryDataTableProps,
  CategoryFormProps,
  CategoryProductInput,
  ChangeProductImageFormProps,
  CostPriceFormProps,
  CostPriceManagerProps,
  ProductDataTableProps,
  ProductFormProps,
  ProductRow,
} from "./CategoriesProducts.types";
import { IoRemoveCircleOutline } from "react-icons/io5";
import type { ImageUploadHandle } from "@/components/atoms/form/Form.types";
import { useAppDispatch } from "@/store/index.util";
import {
  addNewCategory,
  updateCategory,
} from "@/store/slice/category/category.slice";
import type {
  BoxCostPrice,
  Category,
  ProductStatus,
  ResponseWithDataAndMessage,
  ResponseWithOnlyData,
  Supplier,
} from "@/utils/types.utils";
import {
  addNewProduct,
  updateProduct,
  updateProductImage,
} from "@/store/slice/product/product.slice";
import { get, mutate } from "@/utils/http.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { GoPlus } from "react-icons/go";
import { LiaCartPlusSolid } from "react-icons/lia";
import { Headline } from "@/components/atoms/headline/Headline";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { BiSolidEdit } from "react-icons/bi";
import { ProductCard } from "@/components/molecules/product-card/ProductCard";
import { Pill } from "@/components/atoms/pill/Pill";
import { CgImage } from "react-icons/cg";
import { GiTakeMyMoney } from "react-icons/gi";
import { DropdownWithSearch } from "@/components/molecules/dropdown-with-search/DropdownWithSearch";
import {
  getSupplierDetails,
  getSuppliersViaLiveSearch,
} from "../purchase/add-edit-supplies/AddEditSupplier.utils";
import { useFetch } from "@/utils/hooks.utils";
import { FaRegEdit } from "react-icons/fa";
import { Spinner } from "@/components/atoms/spinner/Spinner";
import { BsTrash } from "react-icons/bs";

export function CategoryForm({
  selectedCategory,
  onHideModal,
  onSetAlertDetails,
}: CategoryFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryProductInput>({
    resolver: yupResolver(categorySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedCategory) {
      setValue("name", selectedCategory.name);
    }
  }, [selectedCategory, setValue]);

  const onSubmit: SubmitHandler<CategoryProductInput> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    let result: ResponseWithDataAndMessage<Category>;

    try {
      if (selectedCategory) {
        result = await mutate<ResponseWithDataAndMessage<Category>>(
          data,
          `categories/${selectedCategory.id}`,
          "PATCH",
        );
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        dispatch(updateCategory(result.data));
        reset();
        onHideModal();
      } else {
        result = await mutate<ResponseWithDataAndMessage<Category>>(
          data,
          "categories",
          "POST",
        );
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        dispatch(addNewCategory(result.data));
        reset();
      }
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "success",
      });
      console.error("Failed to add or edit category", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          {...register("name")}
          hasError={Boolean(errors.name)}
        />
        {Boolean(errors.name) && (
          <Form.Error>{errors.name?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>
                {selectedCategory ? "Save changes" : "Save new category"}
              </span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function ProductForm({
  selectedProduct,
  categories,
  onHideModal,
  onSetAlertDetails,
}: ProductFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const imageUploaderRef = useRef<ImageUploadHandle>(null);
  const [categoryDropdownEror, setDropdownError] = useState(false);
  const [category, setCategory] = useState<string>();
  const [status, setStatus] = useState<ProductStatus>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryProductInput>({
    resolver: yupResolver(productSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedProduct) {
      setValue("name", selectedProduct.name);
      setCategory(selectedProduct.categoryName);
      setStatus(selectedProduct.status);
    }
  }, [selectedProduct, setValue]);

  const onSubmit: SubmitHandler<Pick<CategoryProductInput, "name">> = async (
    data,
  ): Promise<void> => {
    if (!category) {
      setDropdownError(true);
      return;
    }

    setIsLoading(true);
    const selectedCategory = categories.find(
      (item) => item.name.toLowerCase() === category.toLowerCase(),
    ) as Category;

    let result: ResponseWithDataAndMessage<ProductRow>;

    try {
      if (selectedProduct) {
        result = await mutate<ResponseWithDataAndMessage<ProductRow>>(
          {
            ...data,
            categoryId: selectedCategory.id,
            status,
          },
          `products/${selectedProduct.id}`,
          "PATCH",
        );
        dispatch(updateProduct(result.data));
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("categoryId", selectedCategory.id.toString());
        if (imageUploaderRef.current?.onGetFile()) {
          formData.append(
            "file",
            imageUploaderRef.current?.onGetFile() as File,
          );
        }
        result = await addProduct(formData);
        dispatch(addNewProduct(result.data));
      }

      setCategory(undefined);
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();
      if (selectedProduct) {
        onHideModal();
      }
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to add or edit product", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {!selectedProduct && (
        <Form.Group className="mb-3">
          <Form.Label className="flex! items-center gap-1">
            <span>Image</span>
            <button
              type="button"
              title="Remove file"
              onClick={() => imageUploaderRef.current?.onRemoveFile()}
              className="text-xl"
            >
              <IoRemoveCircleOutline />
            </button>
          </Form.Label>
          <Form.ImageUploader className="h-50!" ref={imageUploaderRef} />
        </Form.Group>
      )}
      <Form.Group className="mb-4">
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          {...register("name")}
          hasError={Boolean(errors.name)}
        />
        {Boolean(errors.name) && (
          <Form.Error>{errors.name?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Category</Form.Label>
        <Form.Dropdown
          list={categories.map((item) => item.name)}
          placeholder="Select your preferred category"
          onHideError={() => setDropdownError(false)}
          onSelectItem={setCategory}
          selectedItem={category}
          hasError={categoryDropdownEror}
        />
        {categoryDropdownEror && <Form.Error>Category is required</Form.Error>}
      </Form.Group>
      {selectedProduct && (
        <Form.Group className="mb-4">
          <Form.Label>Status</Form.Label>
          <Form.Dropdown
            list={["IN_USE", "DISCONTINUED"]}
            placeholder="Select your preferred status"
            onHideError={() => setDropdownError(false)}
            onSelectItem={
              setStatus as Dispatch<SetStateAction<string | undefined>>
            }
            selectedItem={status}
            hasError={categoryDropdownEror}
          />
          {categoryDropdownEror && (
            <Form.Error>Product status is required</Form.Error>
          )}
        </Form.Group>
      )}
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>
                {selectedProduct ? "Save changes" : "Save new product"}
              </span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function ChangeProductImageForm({
  selectedProduct,
  onHideModal,
  onSetAlertDetails,
}: ChangeProductImageFormProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const imageUploaderRef = useRef<ImageUploadHandle>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    if (!imageUploaderRef.current?.onGetFile()) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setIsLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("file", imageUploaderRef.current?.onGetFile() as File);
      const result = await changeImage(formdata, selectedProduct.id);
      onSetAlertDetails({
        variant: "success",
        message: result.message,
      });
      dispatch(
        updateProductImage({
          id: result.data.productId,
          imagePath: result.data.imagePath,
        }),
      );
      onHideModal();
    } catch (error) {
      console.error("Failed to change product image", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label className="flex! items-center gap-1">
          <span>Image</span>
          <button
            type="button"
            title="Remove file"
            onClick={() => imageUploaderRef.current?.onRemoveFile()}
            className="text-xl"
          >
            <IoRemoveCircleOutline />
          </button>
        </Form.Label>
        <Form.ImageUploader className="h-50!" ref={imageUploaderRef} />
        {hasError && <Form.Error>Image is required</Form.Error>}
      </Form.Group>
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>Save new image</span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function CategoryAndProductHeader({
  pathname,
  isFetching,
  onResetSelectedCategory,
  onResetSelectedProduct,
}: CategoryAndProductHeaderProps): React.JSX.Element {
  return (
    <PageDescriptor title="Categories and Products" spinnerState={isFetching}>
      <div className="flex items-center gap-2">
        <Button
          el="link"
          to={`${pathname}?action=add-category`}
          variant="primary"
          className="flex! items-center gap-1"
          onClick={onResetSelectedCategory}
        >
          <GoPlus />
          <span>Add Category</span>
        </Button>
        <Button
          el="link"
          to={`${pathname}?action=add-product`}
          variant="outline"
          className="flex! items-center gap-1"
          onClick={onResetSelectedProduct}
        >
          <LiaCartPlusSolid />
          <span>Add Product</span>
        </Button>
      </div>
    </PageDescriptor>
  );
}

export function CategoryDataTable({
  categories,
  onSelectItem,
}: CategoryDataTableProps): React.JSX.Element {
  return (
    <div className="basis-full md:basis-3/7 xl:basis-3/8">
      <Headline tag="h5" className="mb-4">
        Categories
      </Headline>
      <DataTable
        columnHeadings={["Name", ""]}
        count={categories.length}
        className="h-[70vh] overflow-auto!"
        hidePaginator
      >
        {categories.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              <DataTable.Actions>
                <DataTable.Action
                  onClick={() => onSelectItem(item.id)}
                  className="hover:bg-gray-100 text-gray-500"
                >
                  <BiSolidEdit />
                  <span>Edit Category</span>
                </DataTable.Action>
              </DataTable.Actions>
            </td>
          </tr>
        ))}
        {!categories.length && (
          <tr>
            <td colSpan={2}>
              <p className="text-center">
                No categories available at the moment
              </p>
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
}

export function ProductDataTable({
  productState,
  pathname,
  onNavigate,
  onSelectItem,
}: ProductDataTableProps): React.JSX.Element {
  return (
    <div className="basis-full md:basis-4/7 xl:basis-5/8">
      <Headline tag="h5" className="mb-4">
        Products
      </Headline>
      <DataTable
        columnHeadings={["Name", "Category", "No. of Cost", "Status", ""]}
        count={productState.count}
        className="max-h-168.75"
      >
        {productState.data.map((item) => (
          <tr key={item.id}>
            <td>
              <ProductCard name={item.name} imagePath={item.imagePath} />
            </td>
            <td>{item.categoryName}</td>
            <td>{item.totalBoxPrices}</td>
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
                    onSelectItem(item.id);
                    onNavigate(`${pathname}?action=change-product-image`);
                  }}
                  className="hover:bg-gray-100 text-gray-500"
                >
                  <CgImage />
                  <span>Change image</span>
                </DataTable.Action>
                <DataTable.Action
                  onClick={() => {
                    onSelectItem(item.id);
                    onNavigate(`${pathname}?action=edit-product`);
                  }}
                  className="hover:bg-gray-100 text-gray-500"
                >
                  <BiSolidEdit />
                  <span>Edit Product</span>
                </DataTable.Action>
                <DataTable.Action
                  onClick={() => {
                    onSelectItem(item.id);
                    onNavigate(`${pathname}?action=cost-prices`);
                  }}
                  className="hover:bg-gray-100 text-gray-500"
                >
                  <GiTakeMyMoney />
                  <span>Cost Prices</span>
                </DataTable.Action>
              </DataTable.Actions>
            </td>
          </tr>
        ))}
        {!productState.data.length && (
          <tr>
            <td colSpan={3}>
              <p className="text-center">No products available at the moment</p>
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
}

export function CostPriceManager({
  selectedProduct,
  onSetAlertDetails,
}: CostPriceManagerProps): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();

  const [costPrices, setCostPrices] = useState<Array<BoxCostPrice>>([]);
  const [selectedPrice, setSelectedPrice] = useState<BoxCostPrice>();

  useEffect(() => {
    const fetchBoxPrices = async (): Promise<void> => {
      setIsFetching(true);

      try {
        const result = await get<ResponseWithOnlyData<Array<BoxCostPrice>>>(
          `products/box-price/${selectedProduct.id}`,
        );
        setCostPrices(result.data);
      } catch (error) {
        console.error("Failed to fetch cost prices", error);
        onSetAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchBoxPrices();
  }, [selectedProduct, setIsFetching, onSetAlertDetails]);

  const updateCostPrices = (data: BoxCostPrice, id?: number): void => {
    if (id) {
      const updatedCostPrices = [...costPrices];
      const index = updatedCostPrices.findIndex((item) => item.id === id);

      if (index === -1) return;

      updatedCostPrices[index] = data;
      setCostPrices(updatedCostPrices);
    } else {
      setCostPrices((prevState) => [...prevState, data]);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center">
        <Spinner color="black" size="md" />
      </div>
    );
  }

  return (
    <>
      <p className="mb-4">
        You can manage cost prices per box / pack for{" "}
        <strong>{selectedProduct.name}</strong> below. You can add, update and
        view various supplier cost prices.
      </p>
      <hr className="my-6 border border-gray-300" />
      <CostPriceForm
        onSetAlertDetails={onSetAlertDetails}
        selectedProduct={selectedProduct}
        selectedPrice={selectedPrice}
        onUpdateCostPrices={updateCostPrices}
        onResetSelectedPrice={() => setSelectedPrice(undefined)}
      />
      <hr className="my-6 border border-gray-300" />
      <Headline tag="h5" className="mb-3">
        Available cost prices
      </Headline>
      <DataTable
        columnHeadings={["Supplier", "Price", ""]}
        count={costPrices.length}
        hidePaginator
      >
        {costPrices.map((item) => (
          <tr key={item.id}>
            <td>
              {item.supplier.name} - ({item.supplier.companyName})
            </td>
            <td>&#8373; {item.price.toFixed(2)}</td>
            <td>
              <DataTable.Action
                className="hover:bg-gray-100 text-gray-500 w-fit!"
                onClick={() => setSelectedPrice(item)}
              >
                <FaRegEdit className="text-xl" />
                <span>Edit</span>
              </DataTable.Action>
            </td>
          </tr>
        ))}
        {!costPrices.length && (
          <tr>
            <td colSpan={3}>
              <p className="text-center">
                No cost price avaliable at the moment
              </p>
            </td>
          </tr>
        )}
      </DataTable>
    </>
  );
}

function CostPriceForm({
  selectedPrice,
  selectedProduct,
  onSetAlertDetails,
  onUpdateCostPrices,
  onResetSelectedPrice,
}: CostPriceFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<{ price: string }>({
    resolver: yupResolver(costPriceSchema),
    mode: "onBlur",
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [supplierError, setSupplierError] = useState(false);

  useEffect(() => {
    if (selectedPrice) {
      setValue("price", selectedPrice.price.toString());
      setSelectedSupplier(selectedPrice.supplier);
    }
  }, [selectedPrice, setValue]);

  const onSubmit: SubmitHandler<{ price: string }> = async (
    data,
  ): Promise<void> => {
    if (!selectedSupplier) {
      setSupplierError(true);
      return;
    }

    setIsLoading(true);
    setSupplierError(false);

    const method = selectedPrice ? "PATCH" : "POST";
    const endpoint = selectedPrice
      ? `products/box-price/${selectedPrice.id}`
      : "products/box-price";

    try {
      const result = await mutate<ResponseWithDataAndMessage<BoxCostPrice>>(
        {
          ...data,
          productId: selectedProduct.id,
          supplierId: selectedSupplier.id,
        },
        endpoint,
        method,
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onUpdateCostPrices(
        {
          id: result.data.id,
          price: result.data.price,
          supplier: result.data.supplier,
        },
        selectedPrice?.id,
      );
      clearInput();
    } catch (error) {
      console.error("Failed to add or edit cost price", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = (): void => {
    reset();
    setSelectedSupplier(undefined);
    onResetSelectedPrice();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Headline tag="h5" className="mb-4">
        {selectedPrice ? "Edit" : "Add"} cost price
      </Headline>
      <Form.Group className="mb-4">
        <Form.Label>Supplier</Form.Label>
        <DropdownWithSearch
          placeholder="Search by supplier name or company name"
          selectedItem={selectedSupplier}
          onSetSelectedItem={setSelectedSupplier}
          onGetValue={getSupplierDetails}
          onGetItems={getSuppliersViaLiveSearch}
          onSetAlertDetails={onSetAlertDetails}
        />
        {supplierError && <Form.Error>{supplierError}</Form.Error>}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="price">Price per box / pack</Form.Label>
        <Form.Control
          type="number"
          {...register("price")}
          hasError={Boolean(errors.price)}
        />
        {errors.price && <Form.Error>{errors.price.message}</Form.Error>}
      </Form.Group>
      <Form.Group className="flex items-center gap-2">
        <Button
          el="button"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-1">
              <IoIosSave />
              <span>{selectedPrice ? "Update" : "Save"}</span>
            </span>
          )}
        </Button>
        <Button
          el="button"
          type="button"
          variant="outline"
          className="flex! items-center gap-1"
          onClick={clearInput}
        >
          <BsTrash />
          <span>Clear</span>
        </Button>
      </Form.Group>
    </Form>
  );
}
