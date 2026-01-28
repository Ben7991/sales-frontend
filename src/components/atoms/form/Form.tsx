import {
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
} from "react";
import type {
  DropdownProps,
  FormControlArrayProps,
  FormControlProps,
  PasswordTogglerProps,
  TextareaProps,
} from "./Form.types";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";

function Form(props: ComponentPropsWithRef<"form">): React.JSX.Element {
  return <form {...props}>{props.children}</form>;
}

function Group(props: ComponentPropsWithoutRef<"div">): React.JSX.Element {
  return <div {...props}>{props.children}</div>;
}

function Label(props: ComponentPropsWithoutRef<"label">): React.JSX.Element {
  const { className, ...rest } = props;

  return (
    <label className={`inline-block mb-1 ${className}`} {...rest}>
      {props.children}
    </label>
  );
}

function Control({
  leftIcon,
  rightIcon,
  hasError,
  ...props
}: FormControlProps): React.JSX.Element {
  const { className, ...reset } = props;
  return (
    <div
      className={`form-control flex items-center gap-2 border bg-white ${
        hasError ? "border-red-600" : "border-gray-200 hover:border-gray-400"
      } rounded-md px-3 py-1.5 ${className}`}
    >
      {leftIcon}
      <input className="grow outline-none" {...reset} />
      {rightIcon}
    </div>
  );
}

function ControlArray({
  list,
  onRemoveItem,
  onUpdateList,
}: FormControlArrayProps): React.ReactElement {
  const handleItemChange = (
    id: number,
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const updatedList = [...list];
    const existingItem = updatedList.find((item) => item.id === id);

    if (!existingItem) {
      return;
    }

    existingItem.data = event.currentTarget.value;
    onUpdateList(updatedList);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item, index) => (
        <div className="flex items-center gap-1" key={item.id}>
          <div className="w-50" key={item.id}>
            <Form.Control
              type="number"
              value={item.data}
              onChange={(e) => handleItemChange(item.id, e)}
              placeholder="0554835290"
            />
          </div>
          {index !== 0 ? (
            <button type="button" onClick={() => onRemoveItem(item.id)}>
              <AiOutlineMinusCircle className="text-xl" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function TextArea({ hasError, ...props }: TextareaProps): React.JSX.Element {
  const { className, ...rest } = props;

  return (
    <textarea
      className={`px-3 py-1.5 block border w-full rounded-md outline-none ${
        hasError ? "border-red-600" : "border-gray-200 hover:border-gray-400"
      } ${className}`}
      {...rest}
    ></textarea>
  );
}

function Dropdown({
  placeholder,
  list,
  selectedItem,
  hasError,
  onHideError,
  onSelectItem,
}: DropdownProps): React.JSX.Element {
  const [show, setShow] = useState(false);

  const handleItemSelection = (item: string): void => {
    onSelectItem(item);
    onHideError();
    setShow(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className={`w-full flex items-center justify-between border border-gray-200 ${hasError ? "border-red-600" : "hover:border-gray-400"} rounded-md px-3 py-1.5 cursor-pointer`}
      >
        <span className={`${!selectedItem ? "text-gray-400" : ""}`}>
          {selectedItem ?? placeholder}
        </span>
        {show ? (
          <RxCaretUp className="text-xl" />
        ) : (
          <RxCaretDown className="text-xl" />
        )}
      </button>
      {show && (
        <div className="absolute top-10 w-full min-h-20 bg-white border border-gray-200 rounded-md py-2">
          {list.map((item) => (
            <button
              type="button"
              className="px-3 py-1.5 block w-full text-left hover:bg-gray-100 cursor-pointer"
              key={item}
              onClick={() => handleItemSelection(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PasswordToggler({
  state,
  onClick,
}: PasswordTogglerProps): React.JSX.Element {
  return (
    <button onClick={onClick} type="button">
      {state ? (
        <GoEye className="text-xl" />
      ) : (
        <GoEyeClosed className="text-xl" />
      )}
    </button>
  );
}

function Error({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <small className="text-red-600 inline-block">{children}</small>;
}

function Checkbox(props: ComponentPropsWithRef<"input">): React.JSX.Element {
  return <input {...props} type="checkbox" id="username" className="w-4 h-4" />;
}

Form.Group = Group;
Form.Label = Label;
Form.Control = Control;
Form.ControlArray = ControlArray;
Form.TextArea = TextArea;
Form.Checkbox = Checkbox;
Form.PasswordToggler = PasswordToggler;
Form.Error = Error;
Form.Dropdown = Dropdown;

export { Form };
