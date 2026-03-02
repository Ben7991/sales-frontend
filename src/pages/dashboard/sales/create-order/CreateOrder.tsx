import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "react-router";

import { Headline } from "@/components/atoms/headline/Headline";
import { getCustomerViaLiveSearch } from "../../customer/Customer.utils";
import type {
  ProductStock,
  Customer,
  OrderSale,
  ResponseWithOnlyData,
  Order,
} from "@/utils/types.utils";
import {
  getCustomerDetails,
  getIdForNextOrderToCreate,
  getProductDetails,
  getUnitPrice,
  getWholesalePriceAndMultiplier,
  removeFromOrdersToCreate,
  saveOrderToCreate,
} from "./CreateOrder.util";
import type { OrderItemToCreate, OrderToCreate } from "./CreateOrder.types";
import { Button } from "@/components/atoms/button/Button";
import { CreateOrEditOrderHeader, OrderItemList } from "./CreateOrder.partials";
import { Alert } from "@/components/molecules/alert/Alert";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Form } from "@/components/atoms/form/Form";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";
import { getStockViaLiveSearch } from "../../categories-products/CategoriesProducts.utils";
import { get, mutate } from "@/utils/http.utils";
import { SectionWrapper } from "@/components/molecules/section-wrapper/SectionWrapper";
import { DropdownWithSearch } from "@/components/molecules/dropdown-with-search/DropdownWithSearch";
import { GoBack } from "@/components/molecules/go-back/GoBack";

export default function CreateOrder(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [selectedProductStock, setSelectedProductStock] =
    useState<ProductStock>();

  const [dropdownError, setDropdownError] = useState(false);
  const [orderSale, setOrderSale] = useState<string>("Wholesale");
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
        const { data } = await get<ResponseWithOnlyData<Order>>(
          `sales/${orderIdToEdit}`,
        );

        if (data.orderStatus !== "OPEN") return;

        setOrderSale(makeFirstLetterUppercase(data.orderSale.toLowerCase()));
        setComment(data.comment);
        setProductStocks(
          data.orderItems
            .map((item) => {
              const { wholesalePrice, multiplier } =
                getWholesalePriceAndMultiplier(
                  data.orderSale,
                  item.productStock,
                  item.quantity,
                );
              return {
                comment: item.comment || "",
                id: item.id,
                price: item.amount / item.quantity,
                quantity: item.quantity.toString(),
                total: item.amount,
                productStock: item.productStock,
                multiplier: multiplier ? multiplier?.toString() : undefined,
                wholesalePrice,
              };
            })
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
        price: getUnitPrice(
          item.productStock,
          orderSale as OrderSale,
          item.wholesalePrice,
        ),
        total:
          +item.quantity *
          getUnitPrice(
            item.productStock,
            orderSale as OrderSale,
            item.wholesalePrice,
          ),
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
          price: getUnitPrice(selectedProductStock, orderSale as OrderSale),
          total: 0,
          quantity: "0",
        },
        ...prevState,
      ];
      setSelectedProductStock(undefined);
      return updatedProductStock;
    });
  };

  const removeItem = (id: number): void => {
    setProductStocks((prevState) => prevState.filter((item) => item.id !== id));
  };

  const saveOrderForLater = (): void => {
    saveOrderToCreate({
      customer: selectedCustomer,
      productStocks,
      orderSale: orderSale.toLowerCase() as OrderSale,
      id: savedOrderToCreateId ?? getIdForNextOrderToCreate(),
    });
    clearOrderDetails();
  };

  const loadOrderToCreate = (item: OrderToCreate): void => {
    setSelectedCustomer(item.customer);
    setProductStocks(item.productStocks);
    setOrderSale(makeFirstLetterUppercase(item.orderSale.toLowerCase()));
    setSavedOrderToCreateId(item.id);
  };

  const clearOrderDetails = (): void => {
    setProductStocks([]);
    setSelectedCustomer(undefined);
    setOrderSale("Wholesale");
    setSelectedProductStock(undefined);
    setSavedOrderToCreateId(undefined);
    setComment("");
  };

  const createOrEditOrder = async (): Promise<void> => {
    setIsLoading(true);

    const endpoint = orderIdToEdit ? `sales/${orderIdToEdit}` : "sales";
    const method = orderIdToEdit ? "PUT" : "POST";
    const data = {
      comment,
      customerId: selectedCustomer!.id,
      orderSale: orderSale.toUpperCase(),
      orderItems: productStocks.map((item) => ({
        stockId: item.id,
        quantity: +item.quantity,
        multiplier: +(item.multiplier ?? 0),
        wholesaleId: item.wholesalePrice?.id ?? 0,
        comment: item.comment,
      })),
    };

    try {
      const result = await mutate<{ message: string }>(data, endpoint, method);
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
      <GoBack path="/dashboard/sales" className="mb-4" />
      <CreateOrEditOrderHeader
        key={productStocks.length}
        title={orderIdToEdit ? "Edit Order" : "Create Order"}
        onSelectOrderToCreate={loadOrderToCreate}
      />
      <SectionWrapper heading="Customer and Order Type">
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
      </SectionWrapper>
      <SectionWrapper heading="Orders Items">
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
          onSetProductStocks={setProductStocks}
          orderSale={orderSale === "Wholesale" ? "WHOLESALE" : "RETAIL"}
          onRemoveItem={removeItem}
          productStocks={productStocks}
        />
      </SectionWrapper>
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
