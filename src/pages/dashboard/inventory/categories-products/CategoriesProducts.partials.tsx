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
  addCategory,
  addProduct,
  categorySchema,
  changeImage,
  editCategory,
  editProduct,
  productSchema,
} from "./CategoriesProducts.utils";
import type {
  CategoryFormProps,
  CategoryProductInput,
  ChangeProductImageFormProps,
  ProductFormProps,
} from "./CategoriesProducts.types";
import { IoRemoveCircleOutline } from "react-icons/io5";
import type { ImageUploadHandle } from "@/components/atoms/form/Form.types";
import { useAppDispatch } from "@/store/index.util";
import {
  addNewCategory,
  updateCategory,
} from "@/store/slice/category/category.slice";
import type {
  Category,
  Product,
  ProductStatus,
  ResponseWithDataAndMessage,
} from "@/utils/types.utils";
import {
  addNewProduct,
  updateProduct,
  updateProductImage,
} from "@/store/slice/product/product.slice";

export function CategoryForm({
  selectedCategory,
  onHideModal,
  onSetAlertDetails,
  onShowAlert,
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
        result = await editCategory(data, selectedCategory.id);
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        dispatch(updateCategory(result.data));
        reset();
        onHideModal();
      } else {
        result = await addCategory(data);
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
      console.log("Failed to add or edit category", error);
    } finally {
      setIsLoading(true);
      onShowAlert();
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
  onShowAlert,
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
      setCategory(selectedProduct.category.name);
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

    let result: ResponseWithDataAndMessage<Product>;

    try {
      if (selectedProduct) {
        result = await editProduct(
          {
            ...data,
            categoryId: selectedCategory.id,
            status,
          },
          selectedProduct.id,
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
      onShowAlert();
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
  onShowAlert,
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
      onShowAlert();
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
