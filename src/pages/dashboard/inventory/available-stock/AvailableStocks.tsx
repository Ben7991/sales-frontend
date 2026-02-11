import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";

import { useFetch } from "@/utils/hooks.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import {
  availableStockReducer,
  initialAvailableStockState,
} from "./AvailableStocks.reducer";
import {
  availableStockColumnHeadings,
  getProductStock,
} from "./AvailableStocks.utils";
import { formatAmount, getPaginatedData } from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { Pill } from "@/components/atoms/pill/Pill";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";

export function AvailableStocks(): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();
  const [availableStockState, availableStockDispatch] = useReducer(
    availableStockReducer,
    initialAvailableStockState,
  );

  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);
  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  useEffect(() => {
    const fetchStocks = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getProductStock(query, page, perPage);
        availableStockDispatch({
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
      <PageDescriptor title="Available Stocks" spinnerState={isFetching} />
      <DataTable
        count={availableStockState.count}
        columnHeadings={availableStockColumnHeadings}
      >
        {availableStockState.data.map((item) => (
          <tr key={item.id}>
            <td>
              <div className="flex items-center gap-2">
                {item.product.imagePath ? (
                  <img
                    className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden"
                    src={`${import.meta.env.VITE_BASE_API_URL}/${item.product.imagePath}`}
                  />
                ) : (
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                    ?
                  </span>
                )}
                <span>{item.product.name}</span>
              </div>
            </td>
            <td>{item.supplier.name}</td>
            <td>&#8373; {formatAmount(+item.retailUnitPrice)}</td>
            <td>&#8373; {formatAmount(+item.wholesaleUnitPrice)}</td>
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
          </tr>
        ))}
      </DataTable>
    </>
  );
}
