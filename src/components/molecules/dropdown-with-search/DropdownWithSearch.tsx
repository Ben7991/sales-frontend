import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { IoMdClose } from "react-icons/io";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

import { useOutsideClick } from "@/utils/hooks.utils";
import type { DropdownWithSearchProps } from "./DropdownWithSearch.types";
import { Spinner } from "@/components/atoms/spinner/Spinner";

export function DropdownWithSearch<T extends { id: number }>({
  placeholder,
  selectedItem,
  children,
  onSetSelectedItem,
  onGetValue,
  onGetItems,
  onSetAlertDetails,
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
        onSetAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setIsSearching(false);
      }
    },
    [onGetItems, onSetAlertDetails],
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
