import type { PurchaseStatus, Supplier } from "@/utils/types.utils";

export type PurchaseRow = {
  id: string;
  createdAt: string;
  status: PurchaseStatus;
  comment?: string;
  miscCosts: number;
  suppliesAmount: number;
  supplier: Pick<Supplier, "name" | "companyName">;
};
