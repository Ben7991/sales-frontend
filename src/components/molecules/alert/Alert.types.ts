export type AlertVariant = "success" | "error";

export type AlertProps = {
  variant: AlertVariant;
  message: string;
  onHide: VoidFunction;
};
