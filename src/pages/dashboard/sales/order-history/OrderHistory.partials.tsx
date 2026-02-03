import { useEffect, useState } from "react";
import { Link } from "react-router";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineFileDownload } from "react-icons/md";

import { OffCanvas } from "@/components/organisms/offcanvas/OffCanvas";
import type { OrderDetailsProps } from "./OrderHistory.types";
import { exportReceiptData, getOrder } from "./OrderHistory.utils";
import type { Order } from "@/utils/types.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { Spinner } from "@/components/atoms/spinner/Spinner";
import { Headline } from "@/components/atoms/headline/Headline";
import { Button } from "@/components/atoms/button/Button";
import { ReceiptManager } from "@/utils/receipt-manager.util";

export function OrderDetails({
  showOffCanvas,
  selectedOrderHistory,
  onHideModal,
}: OrderDetailsProps): React.JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false);
  const [startingPrint, setStartingPrint] = useState(false);

  const [fetchError, setFetchError] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order>();

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        const result = await getOrder(selectedOrderHistory.id);
        setOrderDetails(result.data);
      } catch (error) {
        console.error("Failed to get order details", error);
        setFetchError(true);
      }
    };

    fetchOrder();
  }, [selectedOrderHistory]);

  const handleReceiptDownload = async (id: number): Promise<void> => {
    setIsDownloading(true);

    try {
      const result = await exportReceiptData(id);
      const receiptManager = ReceiptManager.getInstance();
      receiptManager.downloadReceipt(result.data, id);
    } catch (error) {
      console.log("Failed to download receipt", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintReceipt = async (id: number): Promise<void> => {
    setStartingPrint(true);
    try {
      const result = await exportReceiptData(id);
      const receiptManager = ReceiptManager.getInstance();
      receiptManager.printReceipt(result.data);
    } catch (error) {
      console.error("Failed to print receipt", error);
    } finally {
      setStartingPrint(false);
    }
  };

  return (
    <OffCanvas show={showOffCanvas} onHide={onHideModal} title="Order Details">
      {fetchError && (
        <div className="flex gap-2 bg-red-100 text-red-700 rounded-md p-3 mb-4">
          <div className="w-10 h-10">
            <HiOutlineExclamationCircle className="text-2xl" />
          </div>
          <p>
            Error fetching order details, please refresh again. If issue persist
            please contact developer for assistance. Thank you
          </p>
        </div>
      )}
      {!orderDetails ? (
        <div className="flex items-center gap-3">
          <Spinner size="sm" color="black" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <p className="mb-2">
            Order number:{" "}
            <strong className="font-semibold">
              #{orderDetails.id.toString()}
            </strong>
          </p>
          <p className="mb-2">
            Date:{" "}
            <strong>{new Date(orderDetails.orderDate).toLocaleString()}</strong>
          </p>
          <p className="mb-2">
            Customer:{" "}
            <strong>
              <Link
                to={`/dashboard/customers?q=${orderDetails.customer.id}`}
                className="text-blue-600 underline"
              >
                {orderDetails.customer.name}
              </Link>
            </strong>
          </p>
          <p className="mb-2">
            Order type: <strong>{orderDetails.orderSale}</strong>
          </p>
          <p className="mb-4">
            Pending amount to pay:{" "}
            <strong className="font-semibold">
              &#8373;{" "}
              {(orderDetails.orderTotal - orderDetails.amountPaid).toFixed(2)}
            </strong>
          </p>
          <DataTable
            columnHeadings={["Product", "Qty", "Amount", "Amount Paid"]}
            count={orderDetails?.orderItems?.length ?? 0}
            hidePaginator
          >
            {orderDetails?.orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>&#8373; {item.amount.toFixed(2)}</td>
                <td>&#8373; {item.amountPaid.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="text-right">
                <strong>Total</strong>
              </td>
              <td>&#8373; {orderDetails.orderTotal.toFixed(2)}</td>
              <td>&#8373; {orderDetails.amountPaid.toFixed(2)}</td>
            </tr>
          </DataTable>
          <div className="flex items-center gap-2 -mt-3">
            <Button
              el="button"
              type="button"
              variant="primary"
              className="flex! items-center gap-2"
              onClick={() => handlePrintReceipt(+orderDetails.id)}
              disabled={startingPrint}
            >
              {startingPrint ? (
                <Button.Loader />
              ) : (
                <span className="flex items-center gap-2">
                  <BsPrinter className="text-xl" />
                  <span>Print receipt</span>
                </span>
              )}
            </Button>
            <Button
              el="button"
              type="button"
              variant="outline"
              className="flex! items-center gap-2"
              onClick={() => handleReceiptDownload(+orderDetails.id)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Button.Loader />
              ) : (
                <span className="flex items-center gap-2">
                  <MdOutlineFileDownload className="text-xl" />
                  <span>Download receipt</span>
                </span>
              )}
            </Button>
          </div>

          <hr className="my-6" />

          <Headline tag="h4" className="mb-4">
            Payment details
          </Headline>
          {orderDetails.orderPayments.length ? (
            <DataTable
              columnHeadings={["Date", "Amount", "Mode of Payment"]}
              count={orderDetails?.orderPayments?.length ?? 0}
              hidePaginator
            >
              {orderDetails?.orderPayments.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>&#8373; {parseFloat(item.amount).toFixed(2)}</td>
                  <td>{item.paymentMode}</td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p>No payments available at the moment</p>
          )}
        </>
      )}
    </OffCanvas>
  );
}
