import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { FiEye } from "react-icons/fi";
import { PiGearFine } from "react-icons/pi";

import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { useFetch } from "@/utils/hooks.utils";
import { get } from "@/utils/http.utils";
import {
  formatAmount,
  getPaginatedData,
  getSearchParamsForPaginator,
} from "@/utils/helpers.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import type { ResponseWithRecord } from "@/utils/types.utils";
import { Pill } from "@/components/atoms/pill/Pill";
import { Alert } from "@/components/molecules/alert/Alert";
import type { PurchaseRow } from "./PurchaseHistory.types";
import { Button } from "@/components/atoms/button/Button";

export default function PurchaseHistory(): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const [purchaseHistories, setPurchaseHistories] = useState<
    ResponseWithRecord<PurchaseRow>
  >({
    count: 0,
    data: [],
  });

  useEffect(() => {
    const fetchPurchaseHistory = async (): Promise<void> => {
      setIsFetching(true);

      try {
        const searchParams = getSearchParamsForPaginator(query, page, perPage);
        const result = await get<ResponseWithRecord<PurchaseRow>>(
          `purchase?${searchParams.toString()}`,
        );
        setPurchaseHistories(result);
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch purchase", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPurchaseHistory();
  }, [setIsFetching, query, page, perPage, setAlertDetails]);

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <PageDescriptor title="Purchase History" spinnerState={isFetching}>
        <Button
          el="link"
          to="/dashboard/purchases/add-edit"
          variant="primary"
          className="flex! items-center gap-1"
        >
          <PiGearFine />
          <span>Add or Edit Purchase</span>
        </Button>
      </PageDescriptor>
      <DataTable
        columnHeadings={[
          "#",
          "Date Created",
          "Supplier",
          "Supplies Amount",
          "Misc Cost",
          "Status",
          "",
        ]}
        count={purchaseHistories.data.length}
        hidePaginator
      >
        {purchaseHistories.data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>
              {item.supplier.name} - Company({item.supplier.companyName})
            </td>
            <td>&#8373; 0</td>
            <td>&#8373; {formatAmount(item.miscCosts)}</td>
            <td>
              <Pill
                text={item.status}
                variant={
                  item.status === "SCHEDULE"
                    ? "secondary"
                    : item.status === "ARRIVED"
                      ? "primary"
                      : "success"
                }
              />
            </td>
            <td>
              <DataTable.Action
                className="hover:bg-gray-100 w-fit!"
                onClick={() => navigate(`${pathname}/${item.id}`)}
              >
                <FiEye className="text-xl" />
                <span>View</span>
              </DataTable.Action>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
