import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { FiEye } from "react-icons/fi";
import { GiPayMoney } from "react-icons/gi";

import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { useFetch } from "@/utils/hooks.utils";
import type { OrderHistoryItem, OrderHistoryState } from "./OrderHistory.types";
import {
  getOrderHistories,
  orderHistoryColumnHeadings,
} from "./OrderHistory.utils";
import { getPaginatedData } from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { Pill } from "@/components/atoms/pill/Pill";
import { OrderDetails } from "./OrderHistory.partials";

export function OrderHistory(): React.JSX.Element {
  const [selectedOrderHistory, setSelectedOrderHistory] =
    useState<OrderHistoryItem>();
  const { isFetching, setIsFetching } = useFetch();
  const [orderHistory, setOrderHistory] = useState<OrderHistoryState>({
    count: 0,
    data: [],
  });

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getOrderHistories(query, page, perPage);
        setOrderHistory(result);
      } catch (error) {
        console.error("Failed to fetch order history", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchOrders();
  }, [page, perPage, query, setIsFetching]);

  const handleSelectedProduct = (id: number): void => {
    const preferredItem = orderHistory.data.find((item) => item.id === id);

    if (!preferredItem) {
      setSelectedOrderHistory(undefined);
      return;
    }
    setSelectedOrderHistory(preferredItem);
    navigate(`${pathname}?action=details${query ? `&q=${query}` : ""}`);
  };

  const handleHideModal = (): void => {
    navigate(`${pathname}${query ? `?q=${query}` : ""}`);
    setSelectedOrderHistory(undefined);
  };

  const activeAction = searchParams.get("action") as
    | "details"
    | "add-payment"
    | undefined;

  return (
    <>
      <PageDescriptor title="Order History" spinnerState={isFetching} />
      <DataTable
        columnHeadings={orderHistoryColumnHeadings}
        count={orderHistory.data.length}
        hidePaginator
      >
        {orderHistory.data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>{item.customer}</td>
            <td>&#8373; {item.orderTotal.toFixed(2)}</td>
            <td>&#8373; {item.amountPaid.toFixed(2)}</td>
            <td>
              <Pill
                text={item.orderStatus.split("_").join(" ")}
                variant={
                  item.orderStatus === "OPEN"
                    ? "secondary"
                    : item.orderStatus === "CANCELLED"
                      ? "warning"
                      : item.orderStatus === "DEEMED_SATISFIED"
                        ? "primary"
                        : "success"
                }
              />
            </td>
            <td>
              <Pill
                text={item.paidStatus}
                variant={item.paidStatus === "PAID" ? "success" : "danger"}
              />
            </td>
            <td>
              <DataTable.Actions>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => handleSelectedProduct(item.id)}
                >
                  <FiEye className="text-xl" />
                  <span>View details</span>
                </DataTable.Action>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => handleSelectedProduct(item.id)}
                >
                  <GiPayMoney className="text-xl" />
                  <span>Add payment</span>
                </DataTable.Action>
              </DataTable.Actions>
            </td>
          </tr>
        ))}
      </DataTable>
      {selectedOrderHistory && (
        <OrderDetails
          onHideModal={handleHideModal}
          showOffCanvas={activeAction === "details"}
          selectedOrderHistory={selectedOrderHistory}
        />
      )}
    </>
  );
}
