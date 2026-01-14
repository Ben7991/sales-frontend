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
