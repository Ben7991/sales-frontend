import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  CreateOrEditSuppliesHeader,
  ProductItemList,
} from "./AddEditSupplies.partials";
import { SectionWrapper } from "@/components/molecules/section-wrapper/SectionWrapper";
import { DropdownWithSearch } from "@/components/molecules/dropdown-with-search/DropdownWithSearch";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import type {
  Product,
  Purchase,
  ResponseWithOnlyData,
  Supplier,
} from "@/utils/types.utils";
import {
  getPurchasesToCreate,
  getSupplierDetails,
  getSuppliersViaLiveSearch,
  savePurchaseToCreateLater,
} from "./AddEditSupplier.utils";
import type { Supply } from "./AddEditSupplies.types";
import { Alert } from "@/components/molecules/alert/Alert";
import { Button } from "@/components/atoms/button/Button";
import { Headline } from "@/components/atoms/headline/Headline";
import { Form } from "@/components/atoms/form/Form";
import { get, mutate } from "@/utils/http.utils";
import { GoBack } from "@/components/molecules/go-back/GoBack";

export default function AddEditSupplies(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [purchaseIdToEdit, setPurchaseIdToEdit] = useState<string>();
  const [purchaseIdToEditForLater, setPurchaseIdToEditForLater] =
    useState<number>();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [supplies, setSupplies] = useState<Array<Supply>>([]);
  const [comment, setComment] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const updateFieldsForEditing = useCallback((purchase: Purchase): void => {
    setComment(purchase.comment ?? "");
    setPurchaseIdToEdit(purchase.id);
    setSelectedSupplier(purchase.supplier);
    const supplies: Array<Supply> = purchase.supplies.map((item) => ({
      comment: item.comment ?? "",
      numberOfBoxes: item.numberOfBoxes.toString(),
      product: {
        id: item.product.id,
        name: item.product.name,
      },
    }));
    setSupplies(supplies);
  }, []);

  useEffect(() => {
    const fetchPurchaseDetailsToEdit = async (): Promise<void> => {
      try {
        const { data } = await get<ResponseWithOnlyData<Purchase>>(
          `purchase/${searchParams.get("id")}`,
        );

        if (data.status !== "SCHEDULE") {
          throw new Error(
            "You can't edit this order as it's passed the SCHEDULED stage",
          );
        }

        updateFieldsForEditing(data);
      } catch (error) {
        console.error("Failed to fetch purchase details for editing", error);
        setAlertDetails({
          message: "Failed to fetch purchase details for editing",
          variant: "error",
        });
      }
    };

    if (searchParams.has("id")) {
      fetchPurchaseDetailsToEdit();
    }
  }, [searchParams, setAlertDetails, updateFieldsForEditing]);

  const addSupply = (product: Product): void => {
    setSupplies((prevState) => [
      {
        product,
        comment: "",
        numberOfBoxes: "",
      },
      ...prevState,
    ]);
  };

  const removeItem = (id: number): void => {
    const supplyIndex = supplies.findIndex((item) => item.product.id === id);

    if (supplyIndex === -1) return;

    const updatedSupplies = [...supplies];
    const deleteCount = 1;
    updatedSupplies.splice(supplyIndex, deleteCount);
    setSupplies(updatedSupplies);
  };

  const handleBoxNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ): void => {
    const supplyIndex = supplies.findIndex((item) => item.product.id === id);

    if (supplyIndex === -1) return;

    const updatedSupplies = [...supplies];
    updatedSupplies[supplyIndex].numberOfBoxes = e.target.value;
    setSupplies(updatedSupplies);
  };

  const handleCommentChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ): void => {
    const supplyIndex = supplies.findIndex((item) => item.product.id === id);

    if (supplyIndex === -1) return;

    const updatedSupplies = [...supplies];
    updatedSupplies[supplyIndex].comment = e.target.value;
    setSupplies(updatedSupplies);
  };

  const createOrEditPurchase = async (): Promise<void> => {
    setIsLoading(true);

    const endpoints = purchaseIdToEdit
      ? `purchase/${purchaseIdToEdit}`
      : "purchase";
    const method = purchaseIdToEdit ? "PATCH" : "POST";

    try {
      const result = await mutate<{ message: string }>(
        {
          supplies: supplies.map((item) => ({
            productId: item.product.id,
            numberOfBoxes: +item.numberOfBoxes,
            comment: item.comment,
          })),
          supplierId: selectedSupplier!.id,
          comment,
        },
        endpoints,
        method,
      );
      setAlertDetails({
        message: result.message,
        variant: "success",
      });

      if (purchaseIdToEdit) {
        navigate(`/dashboard/purchases/${purchaseIdToEdit}`);
      }
      clearPurchaseDetails();
    } catch (error) {
      console.error("Failed to create or edit purchase", error);
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearPurchaseDetails = (): void => {
    setSelectedSupplier(undefined);
    setSupplies([]);
    setComment("");
    setPurchaseIdToEdit(undefined);
    setPurchaseIdToEditForLater(undefined);
  };

  const savePurchaseForLater = (): void => {
    const id = new Date().getTime();
    savePurchaseToCreateLater(
      {
        id: purchaseIdToEditForLater ?? id,
        supplier: selectedSupplier,
        comment,
        supplies,
      },
      purchaseIdToEditForLater,
    );
    clearPurchaseDetails();
  };

  const selectPurchaseToCreate = (id: number) => {
    const existingRecords = getPurchasesToCreate();
    const preferredPurchase = existingRecords.find((item) => item.id === id);

    if (!preferredPurchase) return;

    setSelectedSupplier(preferredPurchase.supplier);
    setSupplies(preferredPurchase.supplies);
    setComment(preferredPurchase.comment);
    setPurchaseIdToEditForLater(id);
  };

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <GoBack path="/dashboard/purchases" className="mb-4" />
      <CreateOrEditSuppliesHeader
        title={purchaseIdToEdit ? "Edit Purchase" : "Create New Purchase"}
        key={supplies.length}
        onSelectPurchaseToCreate={selectPurchaseToCreate}
      />
      <SectionWrapper heading="Supplier and supplies amount">
        <p className="mb-2">
          Please supplier name in the input field below and the list will be
          updated with your search term
        </p>
        <DropdownWithSearch
          placeholder="Search by supplier name or company name"
          selectedItem={selectedSupplier}
          onSetSelectedItem={setSelectedSupplier}
          onGetValue={getSupplierDetails}
          onGetItems={getSuppliersViaLiveSearch}
          onSetAlertDetails={setAlertDetails}
        />
      </SectionWrapper>
      <ProductItemList
        supplies={supplies}
        onSetAlertDetails={setAlertDetails}
        onRemoveItem={removeItem}
        onAddSupply={addSupply}
        onHandleBoxNumberChange={handleBoxNumberChange}
        onHandleCommentChange={handleCommentChange}
      />
      <div className="bg-white p-3 xl:p-4 border border-gray-200 rounded-md mb-4">
        <Headline tag="h5" className="mb-3">
          Overall Order Comment
        </Headline>
        <Form.TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please add your overall order comment here"
        />
      </div>
      <div className="flex flex-col gap-3 items-center md:justify-between md:flex-row ">
        <div className="flex items-center gap-2">
          <Button
            el="button"
            type="button"
            variant="primary"
            onClick={createOrEditPurchase}
            disabled={isLoading || !(supplies.length && selectedSupplier)}
          >
            {isLoading ? (
              <Button.Loader />
            ) : purchaseIdToEdit ? (
              "Edit Purchase"
            ) : (
              "Create Purchase"
            )}
          </Button>
          <Button
            el="button"
            type="button"
            variant="outline"
            disabled={!supplies.length && !selectedSupplier}
            onClick={clearPurchaseDetails}
          >
            Clear Details
          </Button>
        </div>
        <Button
          el="button"
          type="button"
          variant="primary"
          onClick={() => savePurchaseForLater()}
          disabled={!(supplies.length && selectedSupplier)}
        >
          {purchaseIdToEditForLater
            ? "Save changes for later"
            : "Save for later"}
        </Button>
      </div>
    </>
  );
}
