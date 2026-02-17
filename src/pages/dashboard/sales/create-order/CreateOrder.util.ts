import { type Customer, type ProductStock } from "@/utils/types.utils";
import type { OrderToCreate } from "./CreateOrder.types";

export function getCustomerDetails(customer?: Customer): string {
  if (!customer) return "";
  return `${customer.name} - ${customer.address}`;
}

export function getProductDetails(stock?: ProductStock): string {
  if (!stock) return "";
  return `${stock.product.name} - ${stock.supplier.name} - Boxes(${stock.numberOfBoxes}) - TP(${stock.totalPieces})`;
}

const PRODUCT_STOCKS_KEY = "product-stocks";

export function getIdForNextOrderToCreate(): number {
  const parsedExistingRecords = getOrdersToCreate();
  const seed = 1000;
  return seed + parsedExistingRecords.length + 1;
}

export function saveOrderToCreate(data: OrderToCreate): void {
  const parsedExistingRecords = [...getOrdersToCreate()];
  const existingIndex = parsedExistingRecords.findIndex(
    (item) => item.id === data.id,
  );

  if (existingIndex !== -1) {
    parsedExistingRecords[existingIndex] = data;
    localStorage.setItem(
      PRODUCT_STOCKS_KEY,
      JSON.stringify(parsedExistingRecords),
    );
    return;
  }

  const updatedRecords = [data, ...parsedExistingRecords];
  localStorage.setItem(PRODUCT_STOCKS_KEY, JSON.stringify(updatedRecords));
}

export function getOrdersToCreate(): Array<OrderToCreate> {
  const existingRecords =
    localStorage.getItem(PRODUCT_STOCKS_KEY) ?? JSON.stringify([]);
  const parsedExistingRecords = JSON.parse(
    existingRecords,
  ) as Array<OrderToCreate>;

  return parsedExistingRecords;
}

export function removeFromOrdersToCreate(id: number): Array<OrderToCreate> {
  const parsedExistingRecords = getOrdersToCreate();
  const updatedSavedOrders = parsedExistingRecords.filter(
    (item) => item.id !== id,
  );
  localStorage.setItem(PRODUCT_STOCKS_KEY, JSON.stringify(updatedSavedOrders));
  return updatedSavedOrders;
}

export function getUnitPrice(
  productStock: ProductStock,
  orderSale: string,
): number {
  if (orderSale === "Wholesale") {
    return +productStock.wholesaleUnitPrice;
  }

  return +productStock.retailUnitPrice;
}
