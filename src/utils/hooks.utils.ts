import { useEffect } from "react";

export function useOutsideClick(handleOutsideClick: VoidFunction) {
  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);
}
