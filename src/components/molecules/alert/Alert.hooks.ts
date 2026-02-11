import { useState } from "react";

import type { AlertProps } from "./Alert.types";

export function useAlert() {
  const [alertDetails, setAlertDetails] =
    useState<Omit<AlertProps, "onHide" | "state">>();

  const hideAlert = (): void => {
    setAlertDetails(undefined);
  };

  return {
    alertDetails,
    setAlertDetails,
    hideAlert,
  };
}
