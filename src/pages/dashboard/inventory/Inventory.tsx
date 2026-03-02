import { useEffect, useReducer } from "react";
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
import { InventoryDataTable } from "./Inventory.partials";

export default function Inventory(): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();
  const [stockState, stockDispatch] = useReducer(
    inventoryReducer,
    initialStockState,
  );

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
      />
    </>
  );
}
