import { useState } from "react";

import type { AlertProps } from "./Alert.types";

export function useAlert() {
  const [alertDetails, setAlertDetails] =
    useState<Omit<AlertProps, "onHide" | "state">>();
  const [state, setState] = useState(false);

  const showAlert = (): void => {
    setState(true);
  };

  const hideAlert = (): void => {
    setState(false);
  };

  return {
    state,
    alertDetails,
    setAlertDetails,
    showAlert,
    hideAlert,
  };
}
