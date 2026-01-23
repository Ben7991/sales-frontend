import type { DataWithID } from "@/utils/types.utils";
import type { ComponentPropsWithRef } from "react";

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
