import { useOutsideClick } from "@/utils/hooks.utils";
import { useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

type DropdownProps = {
  placeholder: string;
  list: Array<string>;
  onGetSelectedItem: (item: string) => void;
};

export function Dropdown({
  list,
  placeholder,
  onGetSelectedItem,
}: DropdownProps): React.JSX.Element {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>();

  const handleOutsideClick = (): void => {
    setShow(false);
  };
  useOutsideClick(handleOutsideClick);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-between py-1.5 px-2 rounded-sm border border-gray-300 w-full"
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
      >
        <span className={`${!selectedItem && "text-gray-400"}`}>
          {selectedItem || placeholder}
        </span>
        {show ? (
          <RxCaretUp className="text-2xl" />
        ) : (
          <RxCaretDown className="text-2xl" />
        )}
      </button>
      {show && (
        <div className="absolute bg-white border border-gray-300 rounded-md flex flex-col w-full overflow-hidden shadow-sm left-0">
          {list.map((item) => (
            <button
              type="button"
              className={`text-left inline-block py-1.5 px-2.5 hover:cursor-pointer ${selectedItem === item ? "bg-gray-200" : "hover:bg-gray-100"}`}
              onClick={() => {
                setSelectedItem(item);
                onGetSelectedItem(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
