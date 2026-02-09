import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type DragEvent,
} from "react";
import type {
  DropdownProps,
  FormControlArrayProps,
  FormControlProps,
  ImageUploaderProps,
  PasswordTogglerProps,
  TextareaProps,
} from "./Form.types";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { RiImageAddLine } from "react-icons/ri";
import { useOutsideClick } from "@/utils/hooks.utils";
import { IoMdClose } from "react-icons/io";

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
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!selectedItem) {
      setValue("");
    } else {
      setValue(selectedItem);
    }
  }, [selectedItem]);

  const handleOutsideClick = (): void => {
    setShow(false);
  };

  useOutsideClick(handleOutsideClick);

  const handleItemSelection = (item: string): void => {
    setValue(item);
    onSelectItem(item);
    onHideError();
    setShow(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.currentTarget.value;

    if (!value) {
      setValue("");
      onSelectItem(undefined);
      return;
    }

    setValue(value);
    setShow(true);
  };

  const handleClear = (): void => {
    setValue("");
    onSelectItem("");
  };

  let filteredList: typeof list = [];

  if (selectedItem) {
    filteredList = list;
  } else {
    filteredList = list.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase()),
    );
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center px-3 gap-3 border border-gray-200 ${hasError ? "border-red-600" : "hover:border-gray-400"} rounded-md`}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="grow py-1.5 outline-none"
          onChange={handleChange}
          onClick={(e) => {
            e.stopPropagation();
            setShow(true);
          }}
          value={value}
        />
        <div className="flex items-center gap-2">
          {value && (
            <button className="outline-none" onClick={handleClear}>
              <IoMdClose />
            </button>
          )}
          <button
            className="outline-none"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShow((prevState) => !prevState);
            }}
          >
            {show ? (
              <RxCaretUp className="text-xl" />
            ) : (
              <RxCaretDown className="text-xl" />
            )}
          </button>
        </div>
      </div>
      {show && (
        <div className="absolute top-10 w-full max-h-50 overflow-auto bg-white border border-gray-200 rounded-md py-2 z-1">
          {filteredList.map((item) => (
            <button
              type="button"
              className={`px-3 py-1.5 block w-full text-left ${selectedItem === item ? "bg-gray-200" : "hover:bg-gray-100"} cursor-pointer`}
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

function ImageUploader({
  className,
  ref,
}: ImageUploaderProps): React.JSX.Element {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    onRemoveFile: () => {
      setImagePath(null);
      setFile(null);
    },
    onGetFile: () => file,
  }));

  const showFile = (file: File): void => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImagePath(reader.result as string);
      setFile(file);
    });
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    showFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    showFile(file);
  };

  return (
    <div
      className={`cursor-pointer border-2 border-gray-200 border-dashed bg-gray-100 rounded-md flex items-center justify-center overflow-hidden ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => fileUploadRef.current?.click()}
    >
      {!imagePath ? (
        <div className="basis-[80%] flex flex-col items-center gap-1">
          <RiImageAddLine className="text-4xl" />
          <p>Click or drag and drop your image preferred image</p>
        </div>
      ) : (
        <img
          src={imagePath}
          alt="File upload"
          className="w-full h-full object-cover"
        />
      )}
      <input type="file" ref={fileUploadRef} onChange={handleChange} hidden />
    </div>
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
Form.ImageUploader = ImageUploader;

export { Form };
