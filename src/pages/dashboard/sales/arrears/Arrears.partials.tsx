import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { OffCanvas } from "@/components/organisms/offcanvas/OffCanvas";
import type { ArrearsDetailProps, ArrearsOrder } from "./Arrears.types";
import { getArrearItem } from "./Arrears.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function ArrearsDetail({
  showOffCanvas,
  selectedItem,
  onHideModal,
}: ArrearsDetailProps): React.JSX.Element {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Array<ArrearsOrder>>([]);

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        const result = await getArrearItem(selectedItem.customerId);
        setOrders(result.data);
      } catch (error) {
        console.error("Failed to get order details", error);
      }
    };

    fetchOrder();
  }, [selectedItem]);

  const navigateToOrder = (id: string): void => {
    navigate(`/dashboard/sales/order-history?q=${id}`);
  };

  return (
    <OffCanvas
      show={showOffCanvas}
      onHide={onHideModal}
      title={`Arrears for ${selectedItem.customerName}`}
    >
      <p className="mb-4">
        Below are the list of order(s) to which the arrears have been
        accumulated from.
      </p>
      <DataTable
        columnHeadings={["Order Total", "Amount Paid", "Outstanding Amount"]}
        count={orders.length}
        hidePaginator
      >
        {orders.map((item) => (
          <tr
            key={item.orderId}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => navigateToOrder(item.orderId)}
          >
            <td>&#8373; {item.orderTotal.toFixed(2)}</td>
            <td>&#8373; {item.amountPaid.toFixed(2)}</td>
            <td>&#8373; {item.outstandingAmount.toFixed(2)}</td>
          </tr>
        ))}
      </DataTable>
      <div className="flex gap-2 items-start">
        <HiOutlineExclamationCircle className="text-2xl" />
        <p className="m-0">
          To view the order details, just click on your preferred row
        </p>
      </div>
    </OffCanvas>
  );
}
