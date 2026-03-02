import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { BiSolidEdit } from "react-icons/bi";
import { GoArrowLeft } from "react-icons/go";
import { PiPlus } from "react-icons/pi";
import { BsDatabaseAdd, BsTrash } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { LiaExchangeAltSolid } from "react-icons/lia";

import { Button } from "@/components/atoms/button/Button";
import { Headline } from "@/components/atoms/headline/Headline";
import type {
  PurchaseMiscPrice,
  PurchaseSupply,
  WholesalePrice,
} from "@/utils/types.utils";
import { Pill } from "@/components/atoms/pill/Pill";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { formatAmount } from "@/utils/helpers.utils";
import { Modal } from "@/components/organisms/modal/Modal";
import type {
  PurchaseDetailsDescriptorProps,
  PurchaseDetailsHeaderProps,
  PurchaseDetailsMiscsProps,
  PurchaseDetailsSuppliesProps,
  PurchaseWholesaleDetailsProps,
  PurchaseWholesaleFormAction,
} from "./PurchaseDetails.types";
import {
  PurchaseMiscPriceForm,
  PurchaseWholesalePriceForm,
  SalesDetailsForm,
  StockProductForm,
} from "./PurchaseDetails.forms";
import { OffCanvas } from "@/components/organisms/offcanvas/OffCanvas";
import { destroy } from "@/utils/http.utils";
import { Spinner } from "@/components/atoms/spinner/Spinner";

export function PurchaseDetailsHeader({
  pathname,
  activeAction,
  purchaseDetails,
  onNavigate,
  onHideModal,
  onChangeStatus,
  onSetAlertDetails,
}: PurchaseDetailsHeaderProps): React.JSX.Element {
  return (
    <>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:gap-0 md:justify-between">
        <div className="flex items-center gap-2">
          <Button el="link" variant="outline" to="/dashboard/purchases">
            <GoArrowLeft />
          </Button>
          <Headline tag="h4">Go back</Headline>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          {purchaseDetails?.status === "SCHEDULE" && (
            <>
              <Button
                el="button"
                variant="outline"
                className="hover:bg-gray-100 flex! items-center gap-1"
                onClick={() => {
                  onNavigate(`${pathname}?action=change-status`);
                }}
              >
                <LiaExchangeAltSolid />
                <span>Change status</span>
              </Button>
              <Button
                el="link"
                to={`/dashboard/purchase/add-edit-supplies?id=${purchaseDetails.id}`}
                variant="outline"
                className="flex! items-center gap-1"
              >
                <BiSolidEdit />
                <span>Edit Purchase</span>
              </Button>
            </>
          )}
          {purchaseDetails?.status === "ARRIVED" && (
            <Button
              el="link"
              variant="primary"
              className="flex! items-center gap-1"
              to={`${pathname}?action=stock-products`}
            >
              <BsDatabaseAdd />
              <span>Stock Products</span>
            </Button>
          )}
        </div>
      </div>
      <Modal
        title={"Stock Products"}
        show={activeAction === "stock-products"}
        onHide={onHideModal}
      >
        <StockProductForm
          currentStatus={purchaseDetails.status}
          purchaseId={purchaseDetails.id}
          onChangeStatus={onChangeStatus}
          onHideModal={onHideModal}
          onSetAlertDetails={onSetAlertDetails}
        />
      </Modal>
    </>
  );
}

export function PurchaseDetailsDescriptor({
  purchaseDetails,
}: PurchaseDetailsDescriptorProps): React.JSX.Element {
  return (
    <div className="flex justify-between mb-4">
      <div>
        <p className="mb-2">
          ID: <strong className="font-semibold">#{purchaseDetails?.id}</strong>
        </p>
        <p className="mb-2">
          Date:{" "}
          <strong>
            {new Date(purchaseDetails?.createdAt ?? "").toLocaleString()}
          </strong>
        </p>
      </div>
      <div>
        <p className="mb-2">
          Supplier:{" "}
          <strong>
            <Link
              to={`/dashboard/suppliers?q=${purchaseDetails?.supplier.id}`}
              className="text-blue-600 underline"
            >
              {purchaseDetails?.supplier.name}
            </Link>
          </strong>
        </p>
        <p>
          Status:{" "}
          <Pill
            text={purchaseDetails?.status || ""}
            variant={
              purchaseDetails?.status === "SCHEDULE"
                ? "secondary"
                : purchaseDetails?.status === "ARRIVED"
                  ? "primary"
                  : "success"
            }
          />
        </p>
      </div>
    </div>
  );
}

export function PurchaseDetailsSupplies({
  pathname,
  activeAction,
  purchaseDetails,
  onNavigate,
  onHideModal,
  onSetAlertDetails,
  onSetPurchaseDetails,
  onUpdateSalesDetails,
}: PurchaseDetailsSuppliesProps): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState<PurchaseSupply>();

  const hideModal = (): void => {
    setSelectedItem(undefined);
    onHideModal();
  };

  const updateWholesalePrice = (
    supplyId: number,
    data?: WholesalePrice,
    wholesaleId?: number,
  ): void => {
    const updatedPurchaseDetails = { ...purchaseDetails };
    const supplyIndex = updatedPurchaseDetails.supplies.findIndex(
      (item) => item.id === supplyId,
    );

    if (data && !wholesaleId) {
      updatedPurchaseDetails.supplies[
        supplyIndex
      ].purchaseItemWholesalePrices.push(data);
    } else if (data && wholesaleId) {
      const wholesaleIndex = updatedPurchaseDetails.supplies[
        supplyIndex
      ].purchaseItemWholesalePrices.findIndex(
        (item) => item.id === wholesaleId,
      );

      if (wholesaleIndex === -1) return;

      updatedPurchaseDetails.supplies[supplyIndex].purchaseItemWholesalePrices[
        wholesaleIndex
      ] = data;
    }
    onSetPurchaseDetails(updatedPurchaseDetails);
  };

  return (
    <>
      <Headline tag="h4" className="mb-3">
        Supplies
      </Headline>
      <DataTable
        columnHeadings={[
          "Product",
          "Cost",
          "Boxes / Packs",
          "Unit Price(retail)",
          "Total Pieces",
          "Wholesale Prices",
          "Comment",
          "",
        ]}
        count={purchaseDetails?.supplies?.length ?? 0}
        hidePaginator
      >
        {purchaseDetails?.supplies.map((item) => (
          <tr key={item.id}>
            <td>{item.product.name}</td>
            <td>&#8373; {formatAmount(item.cost)}</td>
            <td>{item.numberOfBoxes}</td>
            <td>
              &#8373;{" "}
              {item.retailUnitPrice ? formatAmount(item.retailUnitPrice) : 0}
            </td>
            <td>{item.totalPieces ?? "0"}</td>
            <td>{item.purchaseItemWholesalePrices.length}</td>
            <td>{item.comment}</td>
            {purchaseDetails.status === "ARRIVED" && (
              <td>
                <DataTable.Actions>
                  <DataTable.Action
                    className="hover:bg-gray-100"
                    onClick={() => {
                      onNavigate(`${pathname}?action=sales-details`);
                      setSelectedItem(item);
                    }}
                  >
                    Sales Details
                  </DataTable.Action>
                  <DataTable.Action
                    className="hover:bg-gray-100"
                    onClick={() => {
                      onNavigate(`${pathname}?action=wholesale-details`);
                      setSelectedItem(item);
                    }}
                  >
                    Wholesale Details
                  </DataTable.Action>
                </DataTable.Actions>
              </td>
            )}
          </tr>
        ))}
      </DataTable>
      {purchaseDetails && selectedItem && activeAction === "sales-details" && (
        <Modal
          title="Sales Details"
          show={activeAction === "sales-details"}
          onHide={hideModal}
        >
          <SalesDetailsForm
            purchaseDetails={purchaseDetails}
            selectedItem={selectedItem}
            onSetAlertDetails={onSetAlertDetails}
            onUpdateSalesDetails={onUpdateSalesDetails}
            onHideModal={hideModal}
          />
        </Modal>
      )}
      {purchaseDetails &&
        selectedItem &&
        activeAction === "wholesale-details" && (
          <PurchaseWholesaleDetails
            activeAction={activeAction}
            onHideModal={hideModal}
            selectedItem={selectedItem}
            purchaseDetails={purchaseDetails}
            onSetAlertDetails={onSetAlertDetails}
            onUpdateWholePrices={updateWholesalePrice}
          />
        )}
    </>
  );
}

function PurchaseWholesaleDetails({
  selectedItem,
  activeAction,
  purchaseDetails,
  onHideModal,
  onSetAlertDetails,
  onUpdateWholePrices,
}: PurchaseWholesaleDetailsProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const supplyItem = useMemo(
    () =>
      purchaseDetails.supplies.find(
        (item) => item.id === selectedItem.id,
      ) as PurchaseSupply,
    [purchaseDetails, selectedItem],
  );
  const [wholesalePrices, setWholesalePrices] = useState(
    supplyItem.purchaseItemWholesalePrices,
  );

  useEffect(() => {
    const supplyItem = purchaseDetails.supplies.find(
      (item) => item.id === selectedItem.id,
    ) as PurchaseSupply;
    setWholesalePrices(supplyItem.purchaseItemWholesalePrices);
  }, [purchaseDetails, selectedItem]);

  const [selectedWholesaleDetails, setSelectedWholesaleDetails] =
    useState<WholesalePrice>();
  const [preferredAction, setPreferredAction] =
    useState<PurchaseWholesaleFormAction>("add");

  const selectWholesaleDetailsAndAction = (
    item: WholesalePrice,
    action: PurchaseWholesaleFormAction,
  ): void => {
    setSelectedWholesaleDetails(item);
    setPreferredAction(action);
  };

  const deleteWholesalePrice = async (id: number): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await destroy(
        `purchase/${purchaseDetails.id}/wholesale-price/${selectedItem.id}/${id}`,
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      setWholesalePrices((prevState) =>
        prevState.filter((item) => item.id !== id),
      );
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.log("Failed to delete purchase whole price details", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OffCanvas
      title={`Wholesale Details (${selectedItem.product.name})`}
      onHide={onHideModal}
      show={activeAction === "wholesale-details"}
    >
      <p className="mb-4">
        Take full control of your wholesale strategy from this panel. Adjust
        prices depending on how you want to make is easier for purchases by
        customers
      </p>
      <PurchaseWholesalePriceForm
        purchaseId={purchaseDetails.id}
        purchaseItemId={selectedItem.id}
        onSetAlertDetails={onSetAlertDetails}
        onUpdateWholePrices={onUpdateWholePrices}
        preferredAction={preferredAction}
        selectedWholesaleDetails={selectedWholesaleDetails}
        onClearSelectedWholesalePrice={() =>
          setSelectedWholesaleDetails(undefined)
        }
      />
      <hr className="my-6 border border-gray-300" />
      <div className="flex items-center justify-between mb-4">
        <Headline tag="h5">Wholesale Prices</Headline>
        {isLoading && (
          <div className="flex items-center gap-1">
            <Spinner size="sm" color="black" />
            <span>Deleting...</span>
          </div>
        )}
      </div>
      <DataTable
        columnHeadings={["Quantity", "Price", ""]}
        count={wholesalePrices.length}
        hidePaginator
      >
        {wholesalePrices.map((item) => (
          <tr key={item.id}>
            <td>{item.quantity}</td>
            <td>&#8373; {formatAmount(item.price)}</td>
            {purchaseDetails.status === "ARRIVED" && (
              <td>
                <DataTable.Actions>
                  <DataTable.Action
                    className="hover:bg-gray-100"
                    onClick={() =>
                      selectWholesaleDetailsAndAction(item, "edit")
                    }
                    title="Edit"
                  >
                    <FaRegEdit />
                    <span>Edit</span>
                  </DataTable.Action>
                  <DataTable.Action
                    className="hover:bg-gray-100"
                    onClick={() => deleteWholesalePrice(item.id)}
                    title="Delete"
                  >
                    <BsTrash className="text-red-600" />
                    <span className="text-red-600">Delete</span>
                  </DataTable.Action>
                </DataTable.Actions>
              </td>
            )}
          </tr>
        ))}
        {!wholesalePrices.length && (
          <tr>
            <td colSpan={2}>
              <p className="text-center">
                No wholesale price available at the moment
              </p>
            </td>
          </tr>
        )}
      </DataTable>
    </OffCanvas>
  );
}

export function PurchaseDetailsMiscs({
  purchaseDetails,
  pathname,
  activeAction,
  onNavigate,
  onHideModal,
  onSetAlertDetails,
  onSetPurchaseDetails,
}: PurchaseDetailsMiscsProps): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState<PurchaseMiscPrice>();

  const updateMiscPriceDetails = (
    data?: PurchaseMiscPrice,
    id?: number,
  ): void => {
    const updatedPurchaseDetails = { ...purchaseDetails };

    if (id && data) {
      // update
      const miscIndex = updatedPurchaseDetails.purchaseMiscPrices.findIndex(
        (item) => item.id === id,
      );
      if (miscIndex !== -1) {
        updatedPurchaseDetails.purchaseMiscPrices[miscIndex] = data;
      }
    } else if (id && !data) {
      // delete
      updatedPurchaseDetails.purchaseMiscPrices =
        updatedPurchaseDetails.purchaseMiscPrices.filter(
          (item) => item.id !== id,
        );
    } else if (data) {
      // add
      updatedPurchaseDetails.purchaseMiscPrices.push(data);
    }
    onSetPurchaseDetails(updatedPurchaseDetails);
    setSelectedItem(undefined);
  };

  return (
    <>
      <div className="flex items-center justify-between mt-8 mb-3">
        <Headline tag="h4" className="mb-4">
          Miscellaneous Cost
        </Headline>
        {purchaseDetails.status === "ARRIVED" && (
          <Button
            el="link"
            variant="outline"
            to={`${pathname}?action=add-misc-details`}
            className="flex! items-center gap-1"
          >
            <PiPlus /> <span>Add Cost</span>
          </Button>
        )}
      </div>
      <DataTable
        columnHeadings={["Date", "Amount", ""]}
        count={purchaseDetails.purchaseMiscPrices.length ?? 0}
        hidePaginator
      >
        {purchaseDetails.purchaseMiscPrices.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>&#8373; {formatAmount(item.amount)}</td>
            <td>
              <DataTable.Actions>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => {
                    onNavigate(`${pathname}?action=edit-misc-details`);
                    setSelectedItem(item);
                  }}
                  title="Edit"
                >
                  <FaRegEdit />
                  <span>Edit</span>
                </DataTable.Action>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => {
                    onNavigate(`${pathname}?action=delete-misc-details`);
                    setSelectedItem(item);
                  }}
                  title="Delete"
                >
                  <BsTrash className="text-red-600" />
                  <span className="text-red-600">Delete</span>
                </DataTable.Action>
              </DataTable.Actions>
            </td>
          </tr>
        ))}
        {!purchaseDetails?.purchaseMiscPrices.length ? (
          <tr>
            <td colSpan={3}>
              <p className="text-center">
                No miscellaneous cost available at the moment
              </p>
            </td>
          </tr>
        ) : (
          <tr>
            <td className="text-right">
              <strong>Total</strong>
            </td>
            <td>
              &#8373;{" "}
              {formatAmount(
                purchaseDetails?.purchaseMiscPrices.reduce(
                  (prevValue, currentItem) => {
                    prevValue += currentItem.amount;
                    return prevValue;
                  },
                  0,
                ),
              )}
            </td>
          </tr>
        )}
      </DataTable>

      {purchaseDetails && activeAction?.includes("misc-details") && (
        <Modal
          title={
            activeAction === "add-misc-details"
              ? "Add Miscellaneous Cost"
              : activeAction === "edit-misc-details"
                ? "Edit Miscellaneous Cost"
                : "Delete Miscellaneous Cost"
          }
          show={activeAction?.includes("misc-details")}
          onHide={onHideModal}
        >
          <PurchaseMiscPriceForm
            purchase={purchaseDetails}
            onSetAlertDetails={onSetAlertDetails}
            onUpdateMiscPriceDetails={updateMiscPriceDetails}
            selectedItem={selectedItem}
            onHideModal={onHideModal}
            activeAction={activeAction}
          />
        </Modal>
      )}
    </>
  );
}
