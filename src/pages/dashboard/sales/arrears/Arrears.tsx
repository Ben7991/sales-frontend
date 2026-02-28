import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import {
  arrearsColumnHeadings,
  type ArrearsRow,
  type ArrearState,
} from "./Arrears.types";
import {
  formatAmount,
  getPaginatedData,
  getSearchParamsForPaginator,
} from "@/utils/helpers.utils";
import { ArrearsDetail } from "./Arrears.partials";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import type { ResponseWithRecord } from "@/utils/types.utils";
import { get } from "@/utils/http.utils";
import { Info } from "@/components/molecules/info/Info";

export default function Arrears(): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState<ArrearsRow>();
  const [arrears, setArrears] = useState<ArrearState>({
    count: 0,
    data: [],
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);
  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        const searchParams = getSearchParamsForPaginator(query, page, perPage);
        const result = await get<ResponseWithRecord<ArrearsRow>>(
          `report/arrears?${searchParams.toString()}`,
        );
        setArrears(result);
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch arrears", error);
      }
    };

    fetchOrders();
  }, [page, perPage, query, setAlertDetails]);

  const handleSelectedItem = (id: number): void => {
    const preferredItem = arrears.data.find((item) => item.customerId === id);

    if (!preferredItem) {
      return;
    }

    setSelectedItem(preferredItem);
    navigate(`${pathname}?action=view-list`);
  };

  const handleHideModal = (): void => {
    navigate(pathname);
    setSelectedItem(undefined);
  };

  const activeAction = searchParams.get("action") as string | undefined;

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <PageDescriptor title="Arrears" />
      <DataTable
        columnHeadings={arrearsColumnHeadings}
        count={arrears.data.length}
        hidePaginator
      >
        {arrears.data.map((item) => (
          <tr
            key={item.customerId}
            onClick={() => handleSelectedItem(item.customerId)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <td>{item.customerName}</td>
            <td>{item.totalOrders}</td>
            <td>&#8373; {formatAmount(item.totalAmountToPay)}</td>
            <td>
              {item.lastDatePaid
                ? new Date(item.lastDatePaid).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))}
      </DataTable>
      <br />
      <Info>
        <p>To view the arrears details, just click on your preferred row</p>
      </Info>
      {selectedItem && (
        <ArrearsDetail
          onHideModal={handleHideModal}
          showOffCanvas={Boolean(activeAction)}
          selectedItem={selectedItem}
          onSetAlertDetails={setAlertDetails}
        />
      )}
    </>
  );
}
