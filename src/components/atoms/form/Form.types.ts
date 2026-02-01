import type { DataWithID } from "@/utils/types.utils";
import type { ComponentPropsWithRef, RefObject } from "react";

export type FormControlProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasError?: boolean;
} & ComponentPropsWithRef<"input">;

export type PasswordTogglerProps = {
  state: boolean;
  onClick: VoidFunction;
};

export type FormControlArrayProps = {
  list: Array<DataWithID>;
  onUpdateList: (value: Array<DataWithID>) => void;
  onRemoveItem: (id: number) => void;
};

export type TextareaProps = Pick<FormControlProps, "hasError"> &
  ComponentPropsWithRef<"textarea">;

export type DropdownProps = {
  placeholder: string;
  selectedItem?: string;
  list: Array<string>;
  hasError?: boolean;
  onHideError: VoidFunction;
  onSelectItem: (item?: string) => void;
};

export type ImageUploaderProps = {
  className?: string;
  ref: RefObject<ImageUploadHandle | null>;
};

export type ImageUploadHandle = {
  onRemoveFile: VoidFunction;
  onGetFile: () => File | null;
};
