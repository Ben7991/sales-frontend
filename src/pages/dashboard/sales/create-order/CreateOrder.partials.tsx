import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Spinner } from "@/components/atoms/spinner/Spinner";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

import type {
  CreateOrEditHeaderProps,
  DropdownWithSearchProps,
  OrderItemListProps,
  OrderToCreate,
} from "./CreateOrder.types";
import { useOutsideClick } from "@/utils/hooks.utils";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { Button } from "@/components/atoms/button/Button";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { Form } from "@/components/atoms/form/Form";
import { IoCloseCircleOutline } from "react-icons/io5";
import { formatAmount } from "@/utils/helpers.utils";
import {
  getOrdersToCreate,
  removeFromOrdersToCreate,
} from "./CreateOrder.util";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

export function DropdownWithSearch<T extends { id: number }>({
  placeholder,
  selectedItem,
  children,
  onSetSelectedItem,
  onGetValue,
  onGetItems,
}: DropdownWithSearchProps<T>): React.JSX.Element {
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showList, setShowList] = useState(false);

  const [items, setItems] = useState<Array<T>>([]);
  const [value, setValue] = useState("");

  const searchData = useCallback(
    async (searchTerm?: string): Promise<void> => {
      setIsSearching(true);
      try {
        const result = await onGetItems(searchTerm ?? "");
        setItems(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch item whiles searching to Create or Edit order",
          error,
        );
      } finally {
        setIsSearching(false);
      }
    },
    [onGetItems],
  );

  useEffect(() => {
    if (!selectedItem) {
      setValue("");
      setItems([]);
    } else {
      setValue(onGetValue(selectedItem));
    }
  }, [selectedItem, onGetValue]);

  const handleOutsideClick = (): void => {
    setShowList(false);
  };
  useOutsideClick(handleOutsideClick);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const value = event.target.value;
    setValue(value);

    if (!value) {
      setItems([]);
      onSetSelectedItem(undefined);
      return;
    }

    searchTimerRef.current = setTimeout(() => {
      searchData(value);
    }, 500);
  };

  const handleItemSelection = (item: T): void => {
    onSetSelectedItem(item);
    setValue(onGetValue(item));
  };

  const handleClear = (): void => {
    onSetSelectedItem(undefined);
    setItems([]);
    setValue("");
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center w-full">
      <div className="relative grow bg-white border border-gray-200 rounded-md gap-3 py-1 ps-3 pe-2 flex">
        <input
          type="text"
          className="outline-none grow"
          placeholder={placeholder}
          onClick={(e) => {
            e.stopPropagation();
            setShowList(true);
          }}
          value={value}
          onChange={handleChange}
        />
        <div className="flex items-center gap-1">
          {isSearching && <Spinner size="sm" color="black" />}
          {selectedItem && (
            <button className="outline-none" onClick={handleClear}>
              <IoMdClose />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowList((prevState) => !prevState);
            }}
            className="inline-block py-0.5 px-1 hover:bg-gray-100 rounded-md"
          >
            {showList ? (
              <RxCaretUp className="text-2xl" />
            ) : (
              <RxCaretDown className="text-2xl" />
            )}
          </button>
        </div>
        {showList && (
          <div className="z-1 absolute top-10 left-0 w-full shadow-md space-y-1 bg-white border border-gray-100 rounded-md p-2 max-h-62.5 overflow-y-auto">
            {!items.length && value && !selectedItem && !isSearching && (
              <p>No results found</p>
            )}
            {!items.length && !value && !selectedItem && (
              <p>Enter your search term to see results</p>
            )}
            {!items.length && value && selectedItem && (
              <p>
                Item selected for editing, if you wish to change selected item
                clear and search and the list will be updated
              </p>
            )}
            {isSearching && <p>Searching...</p>}
            {items.map((item) => (
              <button
                key={item.id}
                className={`text-left w-full py-1.5 px-2 rounded-sm ${selectedItem?.id === item.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
                onClick={() => handleItemSelection(item)}
              >
                {onGetValue(item)}
              </button>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export function CreateOrEditHeader({
  onSelectOrderToCreate,
}: CreateOrEditHeaderProps): React.JSX.Element {
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
                    <IoCloseCircleOutline className="text-2xl" />
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
          When the type of order isn't selected, the default unit price is a{" "}
          <strong>WHOLESALE</strong> price
        </p>
      </div>
    </div>
  );
}
