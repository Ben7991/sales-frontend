import { useEffect, useState } from "react";

export function useOutsideClick(handleOutsideClick: VoidFunction) {
  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);
}

export function useFetch() {
  const [isFetching, setIsFetching] = useState(false);

  return { isFetching, setIsFetching };
}
