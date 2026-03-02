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
        "Threshold",
        "Box No.",
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
          <td>{item.minimumThreshold}</td>
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
      <p>Testing</p>
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
