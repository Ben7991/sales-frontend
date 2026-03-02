import React, { useEffect, useState, type ChangeEvent } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import { IoMdAlert } from "react-icons/io";

import type {
  CreateOrEditOrderHeaderProps,
  OrderItemListProps,
  RetailItemsTableProps,
  OrderToCreate,
  WholesaleItemsTableProps,
  WholesaleTableRowProps,
} from "./CreateOrder.types";
import { useOutsideClick } from "@/utils/hooks.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import { formatAmount } from "@/utils/helpers.utils";
import {
  getOrdersToCreate,
  getWholesaleList,
  removeFromOrdersToCreate,
} from "./CreateOrder.util";
import { Info } from "@/components/molecules/info/Info";
import { Dropdown } from "@/components/molecules/dropdown/Dropdown";
import type { WholesalePrice } from "@/utils/types.utils";

export function CreateOrEditOrderHeader({
  title,
  onSelectOrderToCreate,
}: CreateOrEditOrderHeaderProps): React.JSX.Element {
  const [showList, setShowList] = useState(false);
  const [savedOrders, setSavedOrders] = useState<Array<OrderToCreate>>([]);

  const handleOutsideClick = () => {
    setShowList(false);
  };
  useOutsideClick(handleOutsideClick);

  useEffect(() => {
    setSavedOrders(getOrdersToCreate());
  }, []);

  const removeFromSavedOrders = (id: number): void => {
    const updatedSavedOrders = removeFromOrdersToCreate(id);
    setSavedOrders(updatedSavedOrders);
  };

  return (
    <PageDescriptor title={title}>
      <div className="relative">
        <Button
          el="button"
          variant="outline"
          className="flex! items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowList((prevState) => !prevState);
          }}
        >
          <FiEye className="text-xl" />
          <span>View saved list</span>
        </Button>
        {showList && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 p-2 w-62.5 rounded-md shadow-md max-h-37.5 overflow-y-auto z-1">
            {savedOrders.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrderToCreate(item);
                  }}
                  className="text-left py-1.5 hover:font-semibold cursor-pointer ps-2"
                >
                  Order - #{item.id}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromSavedOrders(item.id);
                  }}
                  className="w-8 h-8 rounded-sm cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
            ))}
            {!savedOrders.length ? (
              <p className="ps-2">No items available</p>
            ) : null}
          </div>
        )}
      </div>
    </PageDescriptor>
  );
}

export function OrderItemList({
  orderSale,
  productStocks,
  onRemoveItem,
  onSetProductStocks,
}: OrderItemListProps): React.JSX.Element {
  const handleCommentChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
    id: number,
  ): void => {
    const preferredIndex = productStocks.findIndex((item) => item.id === id);

    if (preferredIndex === -1) return;

    const updatedProductStocks = [...productStocks];
    updatedProductStocks[preferredIndex].comment = event.target.value;
    onSetProductStocks(updatedProductStocks);
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
    onSetProductStocks(updatedProductStocks);
  };

  const handleMultiplierChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
  ): void => {
    const preferredIndex = productStocks.findIndex((item) => item.id === id);

    if (preferredIndex === -1) return;

    const updatedProductStocks = [...productStocks];
    updatedProductStocks[preferredIndex].multiplier = event.target.value;
    updatedProductStocks[preferredIndex].quantity = (
      (updatedProductStocks[preferredIndex].wholesalePrice?.quantity ?? 0) *
      +updatedProductStocks[preferredIndex].multiplier
    ).toString();
    updatedProductStocks[preferredIndex].total =
      updatedProductStocks[preferredIndex].price *
      +updatedProductStocks[preferredIndex].multiplier;
    onSetProductStocks(updatedProductStocks);
  };

  const handleCostChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number,
  ): void => {
    const preferredIndex = productStocks.findIndex((item) => item.id === id);

    if (preferredIndex === -1) return;

    const updatedProductStocks = [...productStocks];
    updatedProductStocks[preferredIndex].total = +event.target.value;
    onSetProductStocks(updatedProductStocks);
  };

  const handleSelectedWholesalePrice = (
    item: WholesalePrice,
    id: number,
  ): void => {
    const preferredIndex = productStocks.findIndex((item) => item.id === id);

    if (preferredIndex === -1) return;

    const updatedProductStocks = [...productStocks];
    updatedProductStocks[preferredIndex].wholesalePrice = item;
    updatedProductStocks[preferredIndex].price = item.price;
    updatedProductStocks[preferredIndex].quantity = (
      (updatedProductStocks[preferredIndex].wholesalePrice?.quantity ?? 0) *
      +(updatedProductStocks[preferredIndex].multiplier ?? 0)
    ).toString();
    updatedProductStocks[preferredIndex].total =
      updatedProductStocks[preferredIndex].price *
      +(updatedProductStocks[preferredIndex].multiplier ?? 0);

    onSetProductStocks(updatedProductStocks);
  };

  return (
    <div className="mt-4">
      {orderSale === "WHOLESALE" ? (
        <WholesaleTable
          productStocks={productStocks}
          onRemoveItem={onRemoveItem}
          onHandleCostChange={handleCostChange}
          onHandleCommentChange={handleCommentChange}
          onHandleMultiplierChange={handleMultiplierChange}
          onSelectWholePrice={handleSelectedWholesalePrice}
        />
      ) : (
        <RetailTable
          onHandleCommentChange={handleCommentChange}
          onHandleQuantityChange={handleQuantityChange}
          onRemoveItem={onRemoveItem}
          productStocks={productStocks}
        />
      )}
      <Info>
        <p>
          When the <strong>type of order</strong> isn't selected, the default
          unit price is a <strong>WHOLESALE</strong> price
        </p>
      </Info>
    </div>
  );
}

function WholesaleTable({
  productStocks,
  onRemoveItem,
  onHandleCostChange,
  onSelectWholePrice,
  onHandleCommentChange,
  onHandleMultiplierChange,
}: WholesaleItemsTableProps): React.JSX.Element {
  return (
    <table className="table-collapse table-auto w-full mb-5">
      <thead>
        <tr>
          <th>Product</th>
          <th>Option</th>
          <th>
            <div className="flex items-center gap-1">
              <span>Multiplier</span>
              <div className="relative tooltip">
                <IoMdAlert className="text-xl" />
                <div className="absolute bg-white w-50 tooltip-content border border-gray-200 shadow-sm rounded-sm p-2 bottom-5 right-0">
                  <small className="font-normal text-gray-600 block mb-1">
                    The number entered here will be used as a multiplier to get
                    the quantity.
                  </small>
                  <small className="font-normal text-gray-600 block">
                    Eg. 1) If option is QTY(1) and the entered number is 5. It
                    means 1 x 5 = 5 as quantity. <br />
                    Eg. 2) if option is QTY(6) and the entered number is 7, 6 x
                    7 = 42 as quantity.
                  </small>
                </div>
              </div>
            </div>
          </th>
          <th>Quantity</th>
          <th>Cost</th>
          <th>Comment</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {productStocks.map((data) => (
          <WholesaleTableRow
            onRemoveItem={onRemoveItem}
            onHandleCostChange={onHandleCostChange}
            onHandleCommentChange={onHandleCommentChange}
            onHandleMultiplierChange={onHandleMultiplierChange}
            onSelectWholePrice={onSelectWholePrice}
            data={data}
          />
        ))}
        {productStocks.length ? (
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <strong>Total cost:</strong>
            </td>
            <td>
              &#8373;{" "}
              {formatAmount(
                productStocks.reduce((prevValue, currentItem) => {
                  prevValue += currentItem.total;
                  return prevValue;
                }, 0),
              )}
            </td>
            <td></td>
            <td></td>
          </tr>
        ) : (
          <tr>
            <td colSpan={6}>
              <p className="text-center">
                No products added to the list at the moment
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

function WholesaleTableRow({
  data,
  onHandleCommentChange,
  onHandleCostChange,
  onHandleMultiplierChange,
  onRemoveItem,
  onSelectWholePrice,
}: WholesaleTableRowProps): React.JSX.Element {
  const setSelectedItem = (value: string): void => {
    const quantity = value.substring(4, value.lastIndexOf(")"));

    if (!quantity) {
      return;
    }

    const wholePrice = data.productStock.wholesalePrices.find(
      (item) => item.quantity === +quantity,
    ) as WholesalePrice;
    onSelectWholePrice(wholePrice, data.id);
  };

  const getQuantityForWholesale = (): string => {
    if (data.productStock.totalPieces === +(data.wholesalePrice?.quantity ?? 0))
      return `${data.multiplier} Boxes/Packs`;

    const value = Math.floor(+data.quantity / data.productStock.totalPieces);

    if (value > 0) {
      const remaining = +data.quantity - data.productStock.totalPieces * value;
      return `${value} Boxes/Packs + ${remaining} more`;
    }

    return data.quantity;
  };

  return (
    <tr key={data.id}>
      <td>
        {data.productStock.product.name} - Boxes(
        {data.productStock.numberOfBoxes}) - TP(
        {data.productStock.totalPieces})
      </td>
      <td>
        <Dropdown
          placeholder="Wholesale price"
          list={getWholesaleList(data.productStock)}
          onGetSelectedItem={setSelectedItem}
        />
      </td>
      <td>
        <input
          type="number"
          value={data.multiplier}
          min={1}
          className="w-20 border border-gray-200 py-1.5 px-2 rounded-sm bg-white"
          onChange={(e) => onHandleMultiplierChange(e, data.id)}
        />
      </td>
      <td key={data.multiplier}>{getQuantityForWholesale()}</td>
      <td>
        <input
          type="number"
          value={data.total}
          min={1}
          className="w-20 border border-gray-200 py-1.5 px-2 rounded-sm bg-white"
          onChange={(e) => onHandleCostChange(e, data.id)}
        />
      </td>
      <td>
        <Form.TextArea
          placeholder="Add comment, it's not necessary though"
          value={data.comment}
          rows={2}
          onChange={(e) => onHandleCommentChange(e, data.id)}
        />
      </td>
      <td>
        <div className="flex items-center">
          <button
            className="cursor-pointer"
            title="Remove item"
            onClick={() => onRemoveItem(data.id)}
          >
            <LuTrash2 className="text-2xl" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function RetailTable({
  productStocks,
  onRemoveItem,
  onHandleCommentChange,
  onHandleQuantityChange,
}: RetailItemsTableProps): React.JSX.Element {
  return (
    <table className="table-collapse table-auto w-full mb-5">
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Cost</th>
          <th>Comment</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {productStocks.map((data) => (
          <tr key={data.id}>
            <td>
              {data.productStock.product.name} - Boxes(
              {data.productStock.numberOfBoxes}) - TP(
              {data.productStock.totalPieces})
            </td>
            <td>
              <input
                type="number"
                value={data.quantity}
                min={1}
                className="w-20 border border-gray-200 py-1.5 px-2 rounded-sm bg-white"
                onChange={(e) => onHandleQuantityChange(e, data.id)}
              />
            </td>
            <td>&#8373; {data.price.toFixed(2)}</td>
            <td>&#8373; {formatAmount(data.total)}</td>
            <td>
              <Form.TextArea
                placeholder="Add comment, it's not necessary though"
                value={data.comment}
                rows={2}
                onChange={(e) => onHandleCommentChange(e, data.id)}
              />
            </td>
            <td>
              <div className="flex items-center">
                <button
                  className="cursor-pointer"
                  title="Remove item"
                  onClick={() => onRemoveItem(data.id)}
                >
                  <LuTrash2 className="text-2xl" />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {productStocks.length ? (
          <tr>
            <td></td>
            <td></td>
            <td>
              <strong>Total cost:</strong>
            </td>
            <td>
              &#8373;{" "}
              {formatAmount(
                productStocks.reduce((prevValue, currentItem) => {
                  prevValue += currentItem.total;
                  return prevValue;
                }, 0),
              )}
            </td>
            <td></td>
            <td></td>
          </tr>
        ) : (
          <tr>
            <td colSpan={6}>
              <p className="text-center">
                No products added to the list at the moment
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
