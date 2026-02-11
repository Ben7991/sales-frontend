import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeFirstLetterUppercase(value?: string): string {
  if (!value) return "";

  if (value.includes("-")) {
    const splittedValue = value.split("-");
    return splittedValue
      .map(
        (str) =>
          `${str.substring(0, 1).toUpperCase()}${str.substring(1).toLowerCase()}`,
      )
      .join(" ");
  }

  return (
    value.substring(0, 1).toUpperCase() + "" + value.substring(1).toLowerCase()
  );
}

export function getPaginatedData(searchParams: URLSearchParams) {
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage") ?? "";
  const query = searchParams.get("q") ?? "";

  let parsedPage = 1,
    parsedPerPage = 10;

  if (page && !Number.isNaN(parseInt(page))) {
    parsedPage = parseInt(page);
  }

  if (perPage && !Number.isNaN(parseInt(perPage))) {
    parsedPerPage = parseInt(perPage);
  }

  return {
    query,
    page: parsedPage,
    perPage: parsedPerPage,
  };
}

export function formatAmount(amount: number): string {
  let formattedStringAmount = "";
  let decimals = "00",
    stringAmountWithoutDecimals = "";
  const stringAmount = amount.toString();

  if (stringAmount.includes(".")) {
    [stringAmountWithoutDecimals, decimals] = stringAmount.split(".");
    if (decimals.length < 2) {
      decimals += "0";
    }
  } else {
    stringAmountWithoutDecimals = stringAmount;
  }

  for (let i = stringAmountWithoutDecimals.length; i >= 0; i -= 3) {
    const value = stringAmountWithoutDecimals.substring(i - 3, i);
    if (!value) break;
    formattedStringAmount = `${value},${formattedStringAmount}`;
  }

  if (
    formattedStringAmount.lastIndexOf(",") ===
    formattedStringAmount.length - 1
  ) {
    formattedStringAmount = formattedStringAmount.substring(
      0,
      formattedStringAmount.length - 1,
    );
  }

  return `${formattedStringAmount}.${decimals}`;
}
