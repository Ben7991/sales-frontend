import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import {
  arrearsColumnHeadings,
  type ArrearsRow,
  type ArrearState,
} from "./Arrears.types";
import { getPaginatedData } from "@/utils/helpers.utils";
import { getArrears } from "./Arrears.utils";
import { ArrearsDetail } from "./Arrears.partials";

export function Arrears(): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState<ArrearsRow>();
  const [arrears, setArrears] = useState<ArrearState>({
    count: 0,
    data: [],
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        const result = await getArrears(query, page, perPage);
        setArrears(result);
      } catch (error) {
        console.error("Failed to fetch arrears", error);
      }
    };

    fetchOrders();
  }, [page, perPage, query]);

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
            <td>&#8373; {item.totalAmountToPay.toFixed(2)}</td>
            <td>{new Date(item.lastDatePaid).toLocaleString()}</td>
          </tr>
        ))}
      </DataTable>
      {selectedItem && (
        <ArrearsDetail
          onHideModal={handleHideModal}
          showOffCanvas={Boolean(activeAction)}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
}
