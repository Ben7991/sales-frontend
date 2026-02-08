import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BsPrinter } from "react-icons/bs";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { CgDanger } from "react-icons/cg";

import { OffCanvas } from "@/components/organisms/offcanvas/OffCanvas";
import type {
  AddPaymentData,
  ChangeOrderStatusProps,
  OrderDetailsProps,
  OrderPaymentFormProps,
} from "./OrderHistory.types";
import {
  addPayment,
  changeOrderStatus,
  exportReceiptData,
  getOrder,
  ORDER_STATUSES,
  orderPaymentSchema,
} from "./OrderHistory.utils";
import type { Order, OrderStatus, PaymentMode } from "@/utils/types.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { Spinner } from "@/components/atoms/spinner/Spinner";
import { Headline } from "@/components/atoms/headline/Headline";
import { Button } from "@/components/atoms/button/Button";
import { ReceiptManager } from "@/utils/receipt-manager.util";
import { Form } from "@/components/atoms/form/Form";
import { Pill } from "@/components/atoms/pill/Pill";
import { formatAmount } from "@/utils/helpers.utils";
import { BiSolidEdit } from "react-icons/bi";

export function OrderDetails({
  showOffCanvas,
  selectedOrderHistory,
  onHideModal,
  onSetAlertDetails,
}: OrderDetailsProps): React.JSX.Element {
  const [isDownloading, setIsDownloading] = useState(false);
  const [startingPrint, setStartingPrint] = useState(false);

  const [orderDetails, setOrderDetails] = useState<Order>();

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        const result = await getOrder(selectedOrderHistory.id);
        setOrderDetails(result.data);
      } catch (error) {
        const message = "Failed to get order details";
        console.error(message, error);
        onSetAlertDetails({
          message,
          variant: "error",
        });
      }
    };

    fetchOrder();
  }, [selectedOrderHistory, onSetAlertDetails]);

  const handleReceiptDownload = async (id: number): Promise<void> => {
    setIsDownloading(true);

    try {
      const result = await exportReceiptData(id);
      const receiptManager = ReceiptManager.getInstance();
      receiptManager.downloadReceipt(result.data, id);
    } catch (error) {
      const message = "Failed to download receipt";
      console.error(message, error);
      onSetAlertDetails({
        message,
        variant: "error",
      });
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
      const message = "Failed to print receipt";
      console.error(message, error);
      onSetAlertDetails({
        message,
        variant: "error",
      });
    } finally {
      setStartingPrint(false);
    }
  };

  return (
    <OffCanvas show={showOffCanvas} onHide={onHideModal} title="Order Details">
      {!orderDetails ? (
        <div className="flex items-center gap-3">
          <Spinner size="sm" color="black" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <div>
              <p className="mb-2">
                Order number:{" "}
                <strong className="font-semibold">
                  #{orderDetails.id.toString()}
                </strong>
              </p>
              <p className="mb-2">
                Date:{" "}
                <strong>
                  {new Date(orderDetails.orderDate).toLocaleString()}
                </strong>
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
              <p>
                Order status:{" "}
                <strong>{orderDetails.orderStatus.split("_").join(" ")}</strong>
              </p>
            </div>
            <div>
              <p className="mb-2">
                Order type: <strong>{orderDetails.orderSale}</strong>
              </p>
              <p className="mb-2">
                Pending amount:{" "}
                <strong className="font-semibold">
                  &#8373;{" "}
                  {(orderDetails.orderTotal - orderDetails.amountPaid).toFixed(
                    2,
                  )}
                </strong>
              </p>
              <p className="mb-2">
                Paid Status:{" "}
                <Pill
                  text={orderDetails.paidStatus}
                  variant={
                    orderDetails.paidStatus === "OUTSTANDING"
                      ? "danger"
                      : "success"
                  }
                />
              </p>
            </div>
          </div>

          <hr className="my-6 border border-gray-300" />
          <div className="flex items-center justify-between mb-4">
            <Headline tag="h4">Order Items</Headline>
            {orderDetails.orderStatus === "OPEN" && (
              <Button
                el="link"
                to={`/dashboard/sales/order?id=${orderDetails.id}`}
                variant="outline"
                className="flex! items-center gap-1"
              >
                <BiSolidEdit className="text-xl" />
                <span>Edit Order</span>
              </Button>
            )}
          </div>

          <DataTable
            columnHeadings={[
              "Product",
              "Qty",
              "Amount",
              "Amount Paid",
              "Comment",
            ]}
            count={orderDetails?.orderItems?.length ?? 0}
            hidePaginator
          >
            {orderDetails?.orderItems.map((item) => (
              <tr key={item.id}>
                <td>{item.productStock.product.name}</td>
                <td>{item.quantity}</td>
                <td>&#8373; {item.amount.toFixed(2)}</td>
                <td>&#8373; {item.amountPaid.toFixed(2)}</td>
                <td>{item.comment}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="text-right">
                <strong>Total</strong>
              </td>
              <td>&#8373; {orderDetails.orderTotal.toFixed(2)}</td>
              <td>&#8373; {orderDetails.amountPaid.toFixed(2)}</td>
              <td></td>
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

          <hr className="my-6 border border-gray-300" />

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
              <tr>
                <td className="text-right">
                  <strong>Total</strong>
                </td>
                <td>&#8373; {formatAmount(orderDetails.amountPaid)}</td>
                <td></td>
              </tr>
            </DataTable>
          ) : (
            <p>No payments available at the moment</p>
          )}
        </>
      )}
    </OffCanvas>
  );
}

export function OrderPaymentForm({
  selectedOrderHistory,
  onSetAlertDetails,
  onSetOrderHistory,
}: OrderPaymentFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ amount: string }>({
    resolver: yupResolver(orderPaymentSchema),
    mode: "onChange",
  });

  const updateOrderHistory = useCallback(
    (data: AddPaymentData): void => {
      const updatedSelectedOrderHistory = selectedOrderHistory;
      updatedSelectedOrderHistory.amountPaid = data.totalAmountPaid;
      updatedSelectedOrderHistory.paidStatus = data.paidStatus;

      onSetOrderHistory((prevState) => {
        const updatedData = [...prevState.data];
        const itemIndex = updatedData.findIndex(
          (item) => item.id === selectedOrderHistory.id,
        );
        const deleteCount = 1;
        updatedData.splice(itemIndex, deleteCount, updatedSelectedOrderHistory);

        return {
          count: prevState.count,
          data: updatedData,
        };
      });
    },
    [selectedOrderHistory, onSetOrderHistory],
  );

  const onSubmit: SubmitHandler<{ amount: string }> = async (
    data,
  ): Promise<void> => {
    if (!paymentMode) {
      setDropdownError(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await addPayment(
        {
          amount: +data.amount,
          paymentMode: paymentMode.toUpperCase().split(" ").join("_"),
        },
        selectedOrderHistory.id,
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();
      setPaymentMode(undefined);
      updateOrderHistory(result.data);
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to record new order payment", error);
    } finally {
      setDropdownError(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-sm flex gap-3">
        <div className="basis-8">
          <CgDanger className="text-2xl" />
        </div>
        <p>
          The current system design is to ensure payments never exceeds. If it
          does, the system will reject the payment.{" "}
        </p>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="amount">Amount</Form.Label>
          <Form.Control
            type="string"
            id="amount"
            {...register("amount")}
            hasError={Boolean(errors.amount)}
            autoFocus
          />
          {Boolean(errors.amount) && (
            <Form.Error>{errors.amount?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Payment Mode</Form.Label>
          <Form.Dropdown
            placeholder="Select payment mode"
            list={["Cash", "Mobile money", "Bank Transfer", "Cheque"]}
            onSelectItem={
              setPaymentMode as Dispatch<SetStateAction<string | undefined>>
            }
            selectedItem={paymentMode}
            hasError={dropdownError}
            onHideError={() => setDropdownError(false)}
          />
          {dropdownError && <Form.Error>Payment mode is required</Form.Error>}
        </Form.Group>
        <Form.Group>
          <Button
            el="button"
            type="submit"
            variant={"primary"}
            disabled={isLoading}
          >
            {isLoading ? (
              <Button.Loader />
            ) : (
              <span className="flex items-center gap-2">
                <IoIosSave />
                <span>Record amount</span>
              </span>
            )}
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export function ChangeOrderStatus({
  selectedOrderHistory,
  onSetAlertDetails,
  onSetOrderHistory,
  onHideModal,
}: ChangeOrderStatusProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);

  const formattedStatus = useMemo((): string => {
    return ORDER_STATUSES.find(
      (item) =>
        item.toLowerCase() ===
        selectedOrderHistory.orderStatus.toLowerCase().split("_").join(" "),
    ) as string;
  }, [selectedOrderHistory]);
  const [status, setOrderStatus] = useState<string | undefined>(
    formattedStatus,
  );

  const updateOrderHistory = useCallback(
    (status: OrderStatus): void => {
      const updatedSelectedOrderHistory = selectedOrderHistory;
      updatedSelectedOrderHistory.orderStatus = status;

      onSetOrderHistory((prevState) => {
        const updatedData = [...prevState.data];
        const itemIndex = updatedData.findIndex(
          (item) => item.id === selectedOrderHistory.id,
        );
        const deleteCount = 1;
        updatedData.splice(itemIndex, deleteCount, updatedSelectedOrderHistory);

        return {
          count: prevState.count,
          data: updatedData,
        };
      });
    },
    [selectedOrderHistory, onSetOrderHistory],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!status) {
      setDropdownError(true);
      return;
    }

    setIsLoading(true);

    try {
      const formattedStatus = status.toUpperCase().split(" ").join("_");
      const result = await changeOrderStatus(
        {
          status: formattedStatus,
        },
        selectedOrderHistory.id,
      );
      updateOrderHistory(formattedStatus as OrderStatus);
      setOrderStatus(undefined);
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onHideModal();
    } catch (error) {
      console.error("Failed to change order status", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-4">
        <Form.Label>Order status</Form.Label>
        <Form.Dropdown
          placeholder="Select order status"
          list={ORDER_STATUSES}
          onSelectItem={setOrderStatus}
          selectedItem={status}
          hasError={dropdownError}
          onHideError={() => setDropdownError(false)}
        />
        {dropdownError && <Form.Error>Order status is required</Form.Error>}
      </Form.Group>
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant={"primary"}
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>Save changes</span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}
