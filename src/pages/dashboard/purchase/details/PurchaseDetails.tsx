import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";

import { get } from "@/utils/http.utils";
import type {
  Purchase,
  PurchaseMiscPrice,
  PurchaseStatus,
  ResponseWithOnlyData,
} from "@/utils/types.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import {
  PurchaseDetailsDescriptor,
  PurchaseDetailsHeader,
  PurchaseDetailsMiscs,
  PurchaseDetailsSupplies,
} from "./PurchaseDetails.partials";
import { Alert } from "@/components/molecules/alert/Alert";
import { useFetch } from "@/utils/hooks.utils";
import { Loader } from "@/components/atoms/loader/Loader";
import { ErrorNotifier } from "@/components/organisms/error-notifier/ErrorNotifier";
import { Modal } from "@/components/organisms/modal/Modal";
import { ChangePurchaseStatusForm } from "./PurchaseDetails.forms";

export default function PurchaseDetails(): React.JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const { isFetching, setIsFetching } = useFetch();
  const [purchaseDetails, setPurchaseDetails] = useState<Purchase>();

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const { id } = useParams();
  useEffect(() => {
    const fetchPurchaseDetails = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await get<ResponseWithOnlyData<Purchase>>(
          `purchase/${id}`,
        );
        setPurchaseDetails(result.data);
      } catch (error) {
        const message = "Failed to get order details";
        console.error(message, error);
        setAlertDetails({
          message,
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchPurchaseDetails();
  }, [id, setAlertDetails, setIsFetching]);

  const hideModal = (): void => {
    navigate(pathname);
  };

  const updateSalesDetails = (
    data: Pick<
      Purchase["supplies"][number],
      "retailUnitPrice" | "totalPieces" | "id" | "numberOfBoxes"
    >,
  ): void => {
    if (!purchaseDetails) return;

    const existingIndex = purchaseDetails.supplies.findIndex(
      (item) => item.id === data.id,
    );

    if (existingIndex === -1) return;

    const updatedPurchaseDetails = { ...purchaseDetails };
    updatedPurchaseDetails.supplies = [...purchaseDetails.supplies];
    updatedPurchaseDetails.supplies[existingIndex].retailUnitPrice =
      data.retailUnitPrice;
    updatedPurchaseDetails.supplies[existingIndex].totalPieces =
      data.totalPieces;
    updatedPurchaseDetails.supplies[existingIndex].numberOfBoxes =
      data.numberOfBoxes;

    setPurchaseDetails(updatedPurchaseDetails);
  };

  const updateMiscPriceDetails = (
    data?: PurchaseMiscPrice,
    id?: number,
  ): void => {
    if (!purchaseDetails) return;

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
    setPurchaseDetails(updatedPurchaseDetails);
  };

  const changeStatus = (status: PurchaseStatus): void => {
    if (!purchaseDetails) return;

    setPurchaseDetails({ ...purchaseDetails, status });
  };

  if (isFetching) {
    return <Loader />;
  }

  if (!purchaseDetails) {
    return (
      <ErrorNotifier
        description="Failed to fetch purchase details"
        path="/dashboard/purchases"
      />
    );
  }

  const activeAction = searchParams.get("action");

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <PurchaseDetailsHeader
        purchaseDetails={purchaseDetails}
        onNavigate={navigate}
        pathname={pathname}
        activeAction={activeAction}
        onHideModal={hideModal}
        onSetAlertDetails={setAlertDetails}
        onChangeStatus={changeStatus}
      />
      <PurchaseDetailsDescriptor purchaseDetails={purchaseDetails} />
      <PurchaseDetailsSupplies
        purchaseDetails={purchaseDetails}
        pathname={pathname}
        activeAction={activeAction}
        onNavigate={navigate}
        onHideModal={hideModal}
        onSetAlertDetails={setAlertDetails}
        onUpdateSalesDetails={updateSalesDetails}
        onSetPurchaseDetails={setPurchaseDetails}
      />
      <PurchaseDetailsMiscs
        purchaseDetails={purchaseDetails}
        activeAction={activeAction}
        onHideModal={hideModal}
        onNavigate={navigate}
        onSetAlertDetails={setAlertDetails}
        pathname={pathname}
        onUpdateMiscPriceDetails={updateMiscPriceDetails}
      />
      <Modal
        title="Change status"
        show={activeAction === "change-status"}
        onHide={hideModal}
      >
        <ChangePurchaseStatusForm
          purchaseId={purchaseDetails.id}
          onSetAlertDetails={setAlertDetails}
          onChangeStatus={changeStatus}
          onHideModal={hideModal}
          currentStatus={purchaseDetails.status}
        />
      </Modal>
    </>
  );
}
