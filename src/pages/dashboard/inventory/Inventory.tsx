import { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";

import { useFetch } from "@/utils/hooks.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import {
  inventoryReducer,
  initialAvailableStockState,
} from "./Inventory.reducer";
import {
  formatAmount,
  getPaginatedData,
  getSearchParamsForPaginator,
} from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { Pill } from "@/components/atoms/pill/Pill";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import { get } from "@/utils/http.utils";
import type { ProductStock, ResponseWithRecord } from "@/utils/types.utils";
import { ProductCard } from "@/components/molecules/product-card/ProductCard";

export default function Inventory(): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();
  const [availableStockState, availableStockDispatch] = useReducer(
    inventoryReducer,
    initialAvailableStockState,
  );

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
        columnHeadings={[
          "Product",
          "Supplier",
          "Unit Price(retail)",
          "Unit Price(wholesale)",
          "Box No.",
          "Total Pieces",
          "Status",
        ]}
      >
        {availableStockState.data.map((item) => (
          <tr key={item.id}>
            <td>
              <ProductCard
                name={item.product.name}
                imagePath={item.product.imagePath}
              />
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
        {!availableStockState.data.length && (
          <tr>
            <td colSpan={7}>
              <p className="text-center">
                No product stocks available at the moment
              </p>
            </td>
          </tr>
        )}
      </DataTable>
    </>
  );
}
