import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

import { Headline } from "@/components/atoms/headline/Headline";
import { getCustomerViaLiveSearch } from "../../customer/Customer.utils";
import type { ProductStock, Customer, OrderSale } from "@/utils/types.utils";
import {
  createOrder,
  editOrder,
  getCustomerDetails,
  getIdForNextOrderToCreate,
  getProductDetails,
  getUnitPrice,
  removeFromOrdersToCreate,
  saveOrderToCreate,
} from "./CreateOrder.util";
import type { OrderItemToCreate, OrderToCreate } from "./CreateOrder.types";
import { Button } from "@/components/atoms/button/Button";
import {
  CreateOrEditHeader,
  DropdownWithSearch,
  OrderItemList,
} from "./CreateOrder.partials";
import { Alert } from "@/components/molecules/alert/Alert";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Form } from "@/components/atoms/form/Form";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";
import { useSearchParams } from "react-router";
import { getOrder } from "../order-history/OrderHistory.utils";
import { getStockViaLiveSearch } from "../../inventory/categories-products/CategoriesProducts.utils";

export function CreateOrder(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [selectedProductStock, setSelectedProductStock] =
    useState<ProductStock>();

  const [dropdownError, setDropdownError] = useState(false);
  const [orderSale, setOrderSale] = useState<string>();
  const [comment, setComment] = useState<string>("");
  const [savedOrderToCreateId, setSavedOrderToCreateId] = useState<number>();
  const [productStocks, setProductStocks] = useState<Array<OrderItemToCreate>>(
    [],
  );

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const [searchParams] = useSearchParams();
  const orderIdToEdit = searchParams.get("id");

  useEffect(() => {
    if (!orderIdToEdit || (orderIdToEdit && /[a-zA-Z]/.test(orderIdToEdit)))
      return;

    const getOrderToEdit = async (): Promise<void> => {
      try {
        const { data } = await getOrder(parseInt(orderIdToEdit));

        if (data.orderStatus !== "OPEN") return;

        setOrderSale(data.orderSale);
        setComment(data.comment);
        setProductStocks(
          data.orderItems
            .map((item) => ({
              comment: item.comment,
              id: item.id,
              price: item.amount / item.quantity,
              quantity: item.quantity.toString(),
              total: item.amount,
              productStock: item.productStock,
            }))
            .reverse(),
        );
        setSelectedCustomer(data.customer);
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch order to edit", error);
      }
    };

    getOrderToEdit();
  }, [orderIdToEdit, setAlertDetails]);

  useEffect(() => {
    if (!orderSale) {
      return;
    }

    setProductStocks((prevState) =>
      prevState.map((item) => ({
        ...item,
        price: getUnitPrice(item.productStock, orderSale),
        total: +item.quantity * getUnitPrice(item.productStock, orderSale),
      })),
    );
  }, [orderSale]);

  const addProductStock = (): void => {
    if (!selectedProductStock) return;

    setProductStocks((prevState) => {
      const existingItem = prevState.find(
        (data) => data.id === selectedProductStock.id,
      );
      if (existingItem) {
        setSelectedProductStock(undefined);
        return prevState;
      }
      const updatedProductStock: Array<OrderItemToCreate> = [
        {
          id: selectedProductStock.id,
          productStock: selectedProductStock,
          comment: "",
          price: getUnitPrice(selectedProductStock, orderSale ?? "Wholesale"),
          total: getUnitPrice(selectedProductStock, orderSale ?? "Wholesale"),
          quantity: "1",
        },
        ...prevState,
      ];
      setSelectedProductStock(undefined);
      return updatedProductStock;
    });
  };

  const handleCommentChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ): void => {
    const preferredIndex = productStocks.findIndex((item) => item.id === id);

    if (preferredIndex === -1) return;

    const updatedProductStocks = [...productStocks];
    updatedProductStocks[preferredIndex].comment = event.target.value;
    setProductStocks(updatedProductStocks);
  };

  const handleQuantityChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
  ): void => {
    const preferredIndex = productStocks.findIndex((item) => item.id === id);

    if (preferredIndex === -1) return;

    const updatedProductStocks = [...productStocks];
    updatedProductStocks[preferredIndex].quantity = event.target.value;
    updatedProductStocks[preferredIndex].total =
      updatedProductStocks[preferredIndex].price *
      +updatedProductStocks[preferredIndex].quantity;
    setProductStocks(updatedProductStocks);
  };

  const removeItem = (id: number): void => {
    setProductStocks((prevState) => prevState.filter((item) => item.id !== id));
  };

  const saveOrderForLater = (): void => {
    saveOrderToCreate({
      customer: selectedCustomer,
      productStocks,
      orderSale: orderSale ? (orderSale.toLowerCase() as OrderSale) : undefined,
      id: savedOrderToCreateId ?? getIdForNextOrderToCreate(),
    });
    clearOrderDetails();
  };

  const loadOrderToCreate = (item: OrderToCreate): void => {
    setSelectedCustomer(item.customer);
    setProductStocks(item.productStocks);
    setOrderSale(
      item.orderSale
        ? makeFirstLetterUppercase(item.orderSale.toLowerCase())
        : undefined,
    );
    setSavedOrderToCreateId(item.id);
  };

  const clearOrderDetails = (): void => {
    setProductStocks([]);
    setSelectedCustomer(undefined);
    setOrderSale(undefined);
    setSelectedProductStock(undefined);
    setSavedOrderToCreateId(undefined);
    setComment("");
  };

  const createOrEditOrder = async (): Promise<void> => {
    setIsLoading(true);

    let result: { message: string } | undefined;

    try {
      if (orderIdToEdit) {
        result = await editOrder(
          {
            comment,
            customer: selectedCustomer!.name,
            orderSale: orderSale!.toUpperCase(),
            orderItems: productStocks.map((item) => ({
              stockId: item.id,
              quantity: +item.quantity,
              comment: item.comment,
            })),
          },
          orderIdToEdit,
        );
      } else {
        result = await createOrder({
          comment,
          customer: selectedCustomer!.name,
          orderSale: orderSale!.toUpperCase(),
          orderItems: productStocks.map((item) => ({
            stockId: item.id,
            quantity: +item.quantity,
            comment: item.comment,
          })),
        });
      }
      setAlertDetails({
        message: result.message,
        variant: "success",
      });
      if (savedOrderToCreateId) {
        removeFromOrdersToCreate(savedOrderToCreateId);
      }
      clearOrderDetails();
    } catch (error) {
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to create or edit order", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <CreateOrEditHeader
        key={productStocks.length}
        onSelectOrderToCreate={loadOrderToCreate}
      />
      <div className="bg-white p-3 xl:p-4 border border-gray-200 rounded-md mb-4">
        <Headline tag="h5" className="mb-4">
          Customer and Order Type
        </Headline>
        <div className="w-full">
          <p className="mb-2">
            Please search and the list will be updated with your search term
          </p>
          <DropdownWithSearch
            placeholder="Search by customer name"
            selectedItem={selectedCustomer}
            onSetSelectedItem={setSelectedCustomer}
            onGetValue={getCustomerDetails}
            onGetItems={getCustomerViaLiveSearch}
            onSetAlertDetails={setAlertDetails}
          >
            <Form.Dropdown
              placeholder="Select the type of order"
              list={["Wholesale", "Retail"]}
              onSelectItem={
                setOrderSale as Dispatch<SetStateAction<string | undefined>>
              }
              selectedItem={orderSale}
              hasError={dropdownError}
              onHideError={() => setDropdownError(false)}
            />
          </DropdownWithSearch>
        </div>
      </div>
      <div className="bg-white p-3 xl:p-4 border border-gray-200 rounded-md mb-4">
        <Headline tag="h5" className="mb-4">
          Orders Items
        </Headline>
        <p className="mb-2">
          Please search and the list will be updated with your search term
        </p>
        <DropdownWithSearch
          placeholder="Search by product name"
          selectedItem={selectedProductStock}
          onSetSelectedItem={setSelectedProductStock}
          onGetValue={getProductDetails}
          onGetItems={getStockViaLiveSearch}
          onSetAlertDetails={setAlertDetails}
        >
          <Button el="button" variant="primary" onClick={addProductStock}>
            Add Product
          </Button>
        </DropdownWithSearch>
        <OrderItemList
          onHandleQuantityChange={handleQuantityChange}
          onHandleCommentChange={handleCommentChange}
          onRemoveItem={removeItem}
          productStocks={productStocks}
        />
      </div>
      <div className="bg-white p-3 xl:p-4 border border-gray-200 rounded-md mb-4">
        <Headline tag="h5" className="mb-3">
          Overall Order Comment
        </Headline>
        <Form.TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please add your overall order comment here"
        />
      </div>
      <div className="flex flex-col gap-3 items-center md:justify-between md:flex-row ">
        <div className="flex items-center gap-2">
          <Button
            el="button"
            type="button"
            variant="primary"
            onClick={createOrEditOrder}
            disabled={
              isLoading ||
              !(productStocks.length && selectedCustomer && orderSale)
            }
          >
            {isLoading ? (
              <Button.Loader />
            ) : orderIdToEdit ? (
              "Edit order"
            ) : (
              "Create Order"
            )}
          </Button>
          <Button
            el="button"
            type="button"
            variant="outline"
            onClick={clearOrderDetails}
          >
            Clear Details
          </Button>
        </div>
        <Button
          el="button"
          type="button"
          variant="primary"
          onClick={saveOrderForLater}
          disabled={!(productStocks.length && selectedCustomer && orderSale)}
        >
          {savedOrderToCreateId ? "Update order" : "Save for later"}
        </Button>
      </div>
    </>
  );
}
