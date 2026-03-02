import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useFetch } from "@/utils/hooks.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { inventoryReducer, initialStockState } from "./Inventory.reducer";
import {
  getPaginatedData,
  getSearchParamsForPaginator,
} from "@/utils/helpers.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import { get } from "@/utils/http.utils";
import type { ProductStock, ResponseWithRecord } from "@/utils/types.utils";
import {
  ChangeThresholdForm,
  InventoryDataTable,
  StockDetails,
} from "./Inventory.partials";
import { Modal } from "@/components/organisms/modal/Modal";

export default function Inventory(): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();
  const [stockState, stockDispatch] = useReducer(
    inventoryReducer,
    initialStockState,
  );
  const [selectedItem, setSelectedItem] = useState<ProductStock>();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  useEffect(() => {
    const fetchStocks = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const searchParams = getSearchParamsForPaginator(query, page, perPage);
        const result = await get<ResponseWithRecord<ProductStock>>(
          `products/stocks?${searchParams.toString()}`,
        );
        stockDispatch({
          type: "load",
          payload: result,
        });
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch product stocks", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStocks();
  }, [page, perPage, query, setIsFetching, setAlertDetails]);

  const hidePanel = (): void => {
    navigate(pathname);
    setSelectedItem(undefined);
  };

  const activeAction = searchParams.get("action");

  console.log(">>>> selectedItem", { selectedItem });

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <PageDescriptor title="Inventory" spinnerState={isFetching} />
      <InventoryDataTable
        pathname={pathname}
        stockState={stockState}
        onNavigate={navigate}
        onSelectItem={setSelectedItem}
      />
      {activeAction === "view-details" && selectedItem && (
        <StockDetails onHidePanel={hidePanel} selectedItem={selectedItem} />
      )}
      {activeAction === "change-threshold" && selectedItem && (
        <Modal show onHide={hidePanel} title="Change Threshold">
          <ChangeThresholdForm
            selectedItem={selectedItem}
            onHidePanel={hidePanel}
            onSetAlertDetails={setAlertDetails}
            onStockDispatch={stockDispatch}
          />
        </Modal>
      )}
    </>
  );
}
