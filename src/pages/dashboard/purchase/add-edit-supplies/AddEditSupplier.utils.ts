import { getSearchParamsWithQuery } from "@/utils/helpers.utils";
import { get } from "@/utils/http.utils";
import type {
  Product,
  ResponseWithRecord,
  Supplier,
} from "@/utils/types.utils";
import type { SavePurchaseToCreateLaterType } from "./AddEditSupplies.types";

export function getSupplierDetails(supplier?: Supplier): string {
  return supplier
    ? `${supplier.name} - Company(${supplier.companyName || "-"})`
    : "";
}

export function getProductDetails(product?: Product): string {
  return product ? product.name : "";
}

export async function getSuppliersViaLiveSearch(
  query: string,
): Promise<ResponseWithRecord<Supplier>> {
  return get<ResponseWithRecord<Supplier>>(
    `suppliers/live-search?${getSearchParamsWithQuery(query).toString()}`,
  );
}

export async function getProductsViaLiveSearch(
  query: string,
): Promise<ResponseWithRecord<Product>> {
  return get<ResponseWithRecord<Product>>(
    `products/live-search?${getSearchParamsWithQuery(query).toString()}`,
  );
}

const PURCHASES_KEY = "purchases";

export const getPurchasesToCreate =
  (): Array<SavePurchaseToCreateLaterType> => {
    const existingRecords =
      localStorage.getItem(PURCHASES_KEY) ?? JSON.stringify([]);
    return JSON.parse(existingRecords) as Array<SavePurchaseToCreateLaterType>;
  };

export const savePurchaseToCreateLater = (
  data: SavePurchaseToCreateLaterType,
  itemId?: number,
): void => {
  const existingRecords = [...getPurchasesToCreate()];

  if (itemId) {
    const preferredIndex = existingRecords.findIndex(
      (item) => item.id === itemId,
    );
    existingRecords[preferredIndex] = data;
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(existingRecords));
    return;
  }

  const dataToSave: Array<SavePurchaseToCreateLaterType> = [
    data,
    ...existingRecords,
  ];
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(dataToSave));
};

export const removeFromPurchasesToCreate = (
  id: number,
): Array<SavePurchaseToCreateLaterType> => {
  const updatedRecords = getPurchasesToCreate().filter(
    (item) => item.id !== id,
  );
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(updatedRecords));
  return updatedRecords;
};
