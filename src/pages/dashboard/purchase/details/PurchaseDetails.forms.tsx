import React, { useEffect, useState, type FormEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosSave } from "react-icons/io";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import {
  miscPriceSchema,
  salesDetailsSchema,
  wholesalePriceSchema,
} from "./PurchaseDetails.utils";
import type {
  PurchaseStatusFormProps,
  PurchaseMiscPriceFormInputs,
  PurchaseMiscPriceFormProps,
  PurchaseWholesalePriceFormInputs,
  PurchaseWholesalePriceFormProps,
  SalesDetailsFormInputs,
  SalesDetailsFormProps,
} from "./PurchaseDetails.types";
import { destroy, mutate } from "@/utils/http.utils";
import type {
  PurchaseMiscPrice,
  PurchaseStatus,
  ResponseWithDataAndMessage,
  WholesalePrice,
} from "@/utils/types.utils";
import { formatAmount } from "@/utils/helpers.utils";
import { Info } from "@/components/molecules/info/Info";
import { GoArrowRight } from "react-icons/go";

export function SalesDetailsForm({
  purchaseDetails,
  selectedItem,
  onHideModal,
  onSetAlertDetails,
  onUpdateSalesDetails,
}: SalesDetailsFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalesDetailsFormInputs>({
    resolver: yupResolver(salesDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      retailUnitPrice: selectedItem.retailUnitPrice?.toString() ?? "",
      totalPieces: selectedItem.totalPieces?.toString() ?? "",
      numberOfBoxes: selectedItem.numberOfBoxes?.toString() ?? "",
    },
  });

  const onSubmit: SubmitHandler<SalesDetailsFormInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await mutate<{ message: string }>(
        {
          ...data,
          totalPieces: +data.totalPieces,
          numberOfBoxes: +data.numberOfBoxes,
        },
        `purchase/${purchaseDetails.id}/set-sales-details/${selectedItem.id}`,
        "PATCH",
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onUpdateSalesDetails({
        id: selectedItem.id,
        totalPieces: +data.totalPieces,
        numberOfBoxes: +data.numberOfBoxes,
        retailUnitPrice: +data.retailUnitPrice,
      });
      onHideModal();
    } catch (error) {
      console.error("Failed to set sales details", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "success",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="retail">Unit Price (retail)</Form.Label>
        <Form.Control
          type="string"
          hasError={Boolean(errors.retailUnitPrice)}
          {...register("retailUnitPrice")}
          autoFocus
        />
        {Boolean(errors.retailUnitPrice) && (
          <Form.Error>{errors.retailUnitPrice?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="retail">Packs / Total Pieces</Form.Label>
        <Form.Control
          type="number"
          hasError={Boolean(errors.totalPieces)}
          {...register("totalPieces")}
        />
        {Boolean(errors.totalPieces) && (
          <Form.Error>{errors.totalPieces?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="retail">Number of Boxes</Form.Label>
        <Form.Control
          type="number"
          hasError={Boolean(errors.numberOfBoxes)}
          {...register("numberOfBoxes")}
        />
        {Boolean(errors.numberOfBoxes) && (
          <Form.Error>{errors.numberOfBoxes?.message}</Form.Error>
        )}
      </Form.Group>
      <Button
        el="button"
        variant="primary"
        className="flex! items-center gap-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <Button.Loader />
        ) : (
          <>
            <IoIosSave />
            <span>Save changes</span>
          </>
        )}
      </Button>
    </Form>
  );
}

export function PurchaseWholesalePriceForm({
  purchaseId,
  purchaseItemId,
  preferredAction,
  selectedWholesaleDetails,
  onSetAlertDetails,
  onUpdateWholePrices,
  onClearSelectedWholesalePrice,
}: PurchaseWholesalePriceFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PurchaseWholesalePriceFormInputs>({
    resolver: yupResolver(wholesalePriceSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (selectedWholesaleDetails) {
      setValue("price", selectedWholesaleDetails.price.toString());
      setValue("quantity", selectedWholesaleDetails.quantity.toString());
    }
  }, [setValue, selectedWholesaleDetails]);

  const onSubmit: SubmitHandler<PurchaseWholesalePriceFormInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    const endpoint =
      preferredAction === "edit" && selectedWholesaleDetails
        ? `purchase/${purchaseId}/wholesale-price/${purchaseItemId}/${selectedWholesaleDetails.id}`
        : `purchase/${purchaseId}/wholesale-price/${purchaseItemId}`;
    const method = preferredAction === "add" ? "POST" : "PATCH";

    try {
      const result = await mutate<ResponseWithDataAndMessage<WholesalePrice>>(
        {
          ...data,
          quantity: +data.quantity,
        },
        endpoint,
        method,
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onUpdateWholePrices(
        purchaseItemId,
        result.data ?? {
          price: +data.price,
          quantity: +data.quantity,
          id: selectedWholesaleDetails?.id,
        },
        selectedWholesaleDetails?.id,
      );
      onClearSelectedWholesalePrice();
      reset();
    } catch (error) {
      console.error("Failed to add or edit wholesale price", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-3 mb-4">
        <Form.Group>
          <Form.Label htmlFor="quantity">Quantity</Form.Label>
          <Form.Control
            type="number"
            id="quantity"
            {...register("quantity")}
            hasError={Boolean(errors.quantity)}
          />
          {Boolean(errors.quantity) && (
            <Form.Error>{errors.quantity?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="price">Price</Form.Label>
          <Form.Control
            type="number"
            id="price"
            {...register("price")}
            hasError={Boolean(errors.price)}
          />
          {Boolean(errors.price) && (
            <Form.Error>{errors.price?.message}</Form.Error>
          )}
        </Form.Group>
      </div>
      <Button
        el="button"
        variant="primary"
        className="flex! items-center gap-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <Button.Loader />
        ) : (
          <>
            <IoIosSave />
            <span>Save changes</span>
          </>
        )}
      </Button>
    </Form>
  );
}

export function PurchaseMiscPriceForm({
  purchase,
  selectedItem,
  activeAction,
  onHideModal,
  onSetAlertDetails,
  onUpdateMiscPriceDetails,
}: PurchaseMiscPriceFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PurchaseMiscPriceFormInputs>({
    resolver: yupResolver(miscPriceSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (selectedItem) {
      setValue("name", selectedItem.name);
      setValue("amount", selectedItem.amount.toString());
    }
  }, [selectedItem, setValue]);

  const onSubmit: SubmitHandler<PurchaseMiscPriceFormInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    const endpoint = selectedItem
      ? `purchase/${purchase.id}/misc-price/${selectedItem.id}`
      : `purchase/${purchase.id}/misc-price`;
    const method = selectedItem ? "PATCH" : "POST";

    try {
      const result = await mutate<
        ResponseWithDataAndMessage<PurchaseMiscPrice>
      >(data, endpoint, method);
      onUpdateMiscPriceDetails(result.data ?? selectedItem, selectedItem?.id);
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();

      if (selectedItem) {
        onHideModal();
      }
    } catch (error) {
      console.error("Failed to either add or edit misc price", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!selectedItem) return;

    setIsLoading(true);

    try {
      const result = await destroy(
        `purchase/${purchase.id}/misc-price/${selectedItem.id}`,
      );
      onUpdateMiscPriceDetails(undefined, selectedItem.id);
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onHideModal();
    } catch (error) {
      console.error("Failed to delete purchase misc cost", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      onSubmit={
        activeAction === "delete-misc-details"
          ? handleDelete
          : handleSubmit(onSubmit)
      }
    >
      {activeAction !== "delete-misc-details" ? (
        <>
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
            <Form.Label htmlFor="amount">Amount</Form.Label>
            <Form.Control
              type="text"
              id="amount"
              {...register("amount")}
              hasError={Boolean(errors.amount)}
            />
            {Boolean(errors.amount) && (
              <Form.Error>{errors.amount?.message}</Form.Error>
            )}
          </Form.Group>
        </>
      ) : (
        <p className="mb-4">
          Are you sure you want to delete this misc price (
          <strong>
            {selectedItem?.name} - &#8373;
            {formatAmount(selectedItem?.amount || 0)}
          </strong>
          )?
        </p>
      )}
      <Button
        el="button"
        variant={activeAction === "delete-misc-details" ? "danger" : "primary"}
        className="flex! items-center gap-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <Button.Loader />
        ) : (
          <>
            <IoIosSave />
            <span>
              {activeAction === "delete-misc-details"
                ? "Yes, delete it"
                : "Save changes"}
            </span>
          </>
        )}
      </Button>
    </Form>
  );
}

export function ChangePurchaseStatusForm({
  purchaseId,
  currentStatus,
  onHideModal,
  onChangeStatus,
  onSetAlertDetails,
}: PurchaseStatusFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const [dropdownError, setDropdownError] = useState(false);
  const [status, setStatus] = useState<string>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!status) {
      setDropdownError(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await mutate<{ message: string }>(
        { status },
        `purchase/${purchaseId}/change-status`,
        "PATCH",
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onChangeStatus(status as PurchaseStatus);
      onHideModal();
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to change purchase status", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Info className="mb-4">
        <p className="mb-2">
          Please note that changing the status of a purchase requires trival
          actions to be take at each step.
        </p>
        <p className="mb-2">
          Therefore, it's advicable to move through each step at a time starting
          with <strong>SCHEDULE</strong>{" "}
          <GoArrowRight className="text-xl inline" /> <strong>ARRIVED</strong>{" "}
          <GoArrowRight className="text-xl inline" /> <strong>STOCK</strong>
        </p>
      </Info>

      <Form.Group className="mb-4">
        <Form.Label htmlFor="status">Status</Form.Label>
        <Form.Dropdown
          placeholder="Set the next state of the purchase"
          list={currentStatus === "ARRIVED" ? ["STOCK"] : ["ARRIVED", "STOCK"]}
          onSelectItem={setStatus}
          selectedItem={status}
          hasError={dropdownError}
          onHideError={() => setDropdownError(false)}
        />
      </Form.Group>
      <Button
        el="button"
        variant={"primary"}
        className="flex! items-center gap-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <Button.Loader />
        ) : (
          <>
            <IoIosSave />
            <span>Save changes</span>
          </>
        )}
      </Button>
    </Form>
  );
}

export function StockProductForm({
  purchaseId,
  currentStatus,
  onChangeStatus,
  onHideModal,
  onSetAlertDetails,
}: PurchaseStatusFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (currentStatus !== "ARRIVED") {
      return Promise.resolve();
    }

    try {
      const result = await mutate<{ message: string }>(
        { status: "STOCK" },
        `purchase/${purchaseId}/change-status`,
        "PATCH",
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onChangeStatus(status as PurchaseStatus);
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to change purchase status to STOCK", error);
    } finally {
      setIsLoading(false);
      onHideModal();
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <p className="mb-2">
        Are you sure you are done with all necessary tasks listed below
      </p>
      <ul className="mb-4 list-disc mx-4">
        <li>
          Setting sales details(<strong>Retail unit price</strong>,{" "}
          <strong>Total pieces</strong> and <strong>Number of boxes</strong>)
          for all purchase items
        </li>
        <li>For each item, you need to set at least one whole price details</li>
        <li>Ensure all miscellaneous cost are not forgotten</li>
      </ul>
      <Button
        el="button"
        variant={"primary"}
        className="flex! items-center gap-1"
        disabled={isLoading}
      >
        {isLoading ? (
          <Button.Loader />
        ) : (
          <>
            <IoIosSave />
            <span>Yes, submit</span>
          </>
        )}
      </Button>
    </Form>
  );
}
