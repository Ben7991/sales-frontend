import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye } from "react-icons/fi";
import { IoIosSave } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";

import { ProductCard } from "@/components/molecules/product-card/ProductCard";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { formatAmount } from "@/utils/helpers.utils";
import type {
  ChangeThresholdFormProps,
  ChangeThresholdInputs,
  InventoryDataTableProps,
  StockDetailsProps,
} from "./Inventory.types";
import { Pill } from "@/components/atoms/pill/Pill";
import { OffCanvas } from "@/components/organisms/offcanvas/OffCanvas";
import { Form } from "@/components/atoms/form/Form";
import { Button } from "@/components/atoms/button/Button";
import { changeThresholdSchema } from "./Inventory.utils";
import { mutate } from "@/utils/http.utils";
import { Headline } from "@/components/atoms/headline/Headline";

export function InventoryDataTable({
  stockState,
  pathname,
  onNavigate,
  onSelectItem,
}: InventoryDataTableProps): React.JSX.Element {
  return (
    <DataTable
      count={stockState.count}
      columnHeadings={[
        "Product",
        "Supplier",
        "Unit Price(retail)",
        "Box/Pack No.",
        "Total Pieces",
        "Status",
        "",
      ]}
    >
      {stockState.data.map((item) => (
        <tr key={item.id}>
          <td>
            <ProductCard
              name={item.product.name}
              imagePath={item.product.imagePath}
            />
          </td>
          <td>{item.supplier.name}</td>
          <td>&#8373; {formatAmount(+item.retailUnitPrice)}</td>
          <td>{item.numberOfBoxes}</td>
          <td>{item.totalPieces}</td>
          <td>
            <Pill
              text={item.status}
              variant={
                item.status === "IN_STOCK"
                  ? "success"
                  : item.status === "LOW_STOCK"
                    ? "secondary"
                    : "danger"
              }
            />
          </td>
          <td>
            <DataTable.Actions>
              <DataTable.Action
                className="hover:bg-gray-100"
                onClick={() => {
                  onNavigate(`${pathname}?action=view-details`);
                  onSelectItem(item);
                }}
              >
                <FiEye />
                <span>View</span>
              </DataTable.Action>
              <DataTable.Action
                className="hover:bg-gray-100"
                onClick={() => {
                  onNavigate(`${pathname}?action=change-threshold`);
                  onSelectItem(item);
                }}
              >
                <BiSolidEdit />
                <span>Change Threshold</span>
              </DataTable.Action>
            </DataTable.Actions>
          </td>
        </tr>
      ))}
      {!stockState.data.length && (
        <tr>
          <td colSpan={7}>
            <p className="text-center">
              No product stocks available at the moment
            </p>
          </td>
        </tr>
      )}
    </DataTable>
  );
}

export function StockDetails({
  selectedItem,
  onHidePanel: onHideOffCanvas,
}: StockDetailsProps): React.JSX.Element {
  return (
    <OffCanvas title="Stock Details" onHide={onHideOffCanvas} show>
      <div>
        <ProductCard
          name={selectedItem.product.name}
          imagePath={selectedItem.product.imagePath}
        />
        <p className="my-2">
          Supplier:{" "}
          <strong className="font-semibold">
            {selectedItem.supplier.name}, Company(
            {selectedItem.supplier.companyName})
          </strong>
        </p>
        <p className="mb-2">
          Box/Pack No.:{" "}
          <strong className="font-semibold">
            {selectedItem.numberOfBoxes} boxes/packs{" "}
            {selectedItem.remainingBoxPieces
              ? `and ${selectedItem.remainingBoxPieces} more pieces quantities`
              : ""}
          </strong>
        </p>
        <p className="mb-2">
          Total Pieces:{" "}
          <strong className="font-semibold">{selectedItem.totalPieces}</strong>
        </p>
        <p className="mb-2">
          Minimum Threshold:{" "}
          <strong className="font-semibold">
            {selectedItem.minimumThreshold}
          </strong>
        </p>
        <p className="mb-2">
          Retail unit price:{" "}
          <strong className="font-semibold">
            &#8373; {formatAmount(selectedItem.retailUnitPrice)}
          </strong>
        </p>
        <p className="mb-2">
          Status:{" "}
          <Pill
            text={selectedItem.status}
            variant={
              selectedItem.status === "IN_STOCK"
                ? "success"
                : selectedItem.status === "LOW_STOCK"
                  ? "secondary"
                  : "danger"
            }
          />
        </p>
      </div>

      <hr className="my-6 border border-gray-300" />
      <Headline tag="h5" className="mb-3">
        Configured wholesale prices
      </Headline>
      <DataTable
        count={selectedItem.wholesalePrices.length}
        hidePaginator
        columnHeadings={["Quantity", "Price"]}
      >
        {selectedItem.wholesalePrices.map((item) => (
          <tr key={item.id}>
            <td>{item.quantity}</td>
            <td>&#8373; {formatAmount(item.price)}</td>
          </tr>
        ))}
      </DataTable>

      <hr className="my-6 border border-gray-300" />
      <Headline tag="h5" className="mb-3">
        Comment
      </Headline>
      {selectedItem.comment ? (
        <p>{selectedItem.comment}</p>
      ) : (
        <p>No comment available on this product stock</p>
      )}
    </OffCanvas>
  );
}

export function ChangeThresholdForm({
  selectedItem,
  onHidePanel,
  onSetAlertDetails,
  onStockDispatch,
}: ChangeThresholdFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeThresholdInputs>({
    resolver: yupResolver(changeThresholdSchema),
    mode: "onBlur",
    defaultValues: {
      minimumThreshold: selectedItem.minimumThreshold.toString(),
    },
  });

  const onSubmit: SubmitHandler<ChangeThresholdInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await mutate<{ message: string }>(
        { minimumThreshold: +data.minimumThreshold },
        `products/stocks/${selectedItem.id}/minimum-threshold`,
        "PATCH",
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onHidePanel();
      onStockDispatch({
        type: "change-threshold",
        payload: {
          id: selectedItem.id,
          minimumThreshold: +data.minimumThreshold,
        },
      });
    } catch (error) {
      console.error("Failed to change minimum threshold", error);
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
      <Form.Group className="mb-4">
        <Form.Label htmlFor="threshold">Minimum Threshold</Form.Label>
        <Form.Control
          type="number"
          {...register("minimumThreshold")}
          hasError={Boolean(errors.minimumThreshold)}
          autoFocus
        />
        {Boolean(errors.minimumThreshold) && (
          <Form.Error>{errors.minimumThreshold?.message}</Form.Error>
        )}
      </Form.Group>
      <Button el="button" type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? (
          <Button.Loader />
        ) : (
          <span className="flex items-center gap-2">
            <IoIosSave />
            <span>Save changes</span>
          </span>
        )}
      </Button>
    </Form>
  );
}
