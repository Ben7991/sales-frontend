import { useEffect, useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { LuTrash2 } from "react-icons/lu";

import type {
  CreateOrEditOrderHeaderProps,
  OrderItemListProps,
  OrderToCreate,
} from "./CreateOrder.types";
import { useOutsideClick } from "@/utils/hooks.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import { formatAmount } from "@/utils/helpers.utils";
import {
  getOrdersToCreate,
  removeFromOrdersToCreate,
} from "./CreateOrder.util";

export function CreateOrEditOrderHeader({
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
    <PageDescriptor title="Create or Edit Order">
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
  productStocks,
  onRemoveItem,
  onHandleCommentChange,
  onHandleQuantityChange,
}: OrderItemListProps): React.JSX.Element {
  return (
    <div className="overflow-auto mt-4">
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
      <div className="flex gap-2 items-center">
        <AiOutlineExclamationCircle className="text-xl" />
        <p>
          When the <strong>type of order</strong> isn't selected, the default
          unit price is a <strong>WHOLESALE</strong> price
        </p>
      </div>
    </div>
  );
}
