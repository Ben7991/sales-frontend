import type { PurchaseStatus, Supplier } from "@/utils/types.utils";

export type PurchaseRow = {
  id: string;
  createdAt: string;
  amount?: number;
  status: PurchaseStatus;
  comment?: string;
  miscCosts: number;
  supplier: Pick<Supplier, "name" | "companyName">;
};
