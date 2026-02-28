import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router";

import type {
  PreferredAlertPropsForForm,
  Purchase,
  PurchaseMiscPrice,
  PurchaseStatus,
  PurchaseSupply,
  WholesalePrice,
} from "@/utils/types.utils";

export type PurchaseDetailsDescriptorProps = {
  purchaseDetails: Purchase;
};

export type PurchaseDetailsHeaderProps = PurchaseDetailsDescriptorProps &
  Pick<
    PurchaseDetailsSuppliesProps,
    "onNavigate" | "pathname" | "activeAction"
  > &
  Pick<PurchaseStatusFormProps, "onChangeStatus"> &
  PreferredAlertPropsForForm;

export type PurchaseDetailsSuppliesProps = {
  pathname: string;
  activeAction: string | null;
  onNavigate: NavigateFunction;
  onSetPurchaseDetails: Dispatch<SetStateAction<Purchase | undefined>>;
} & PurchaseDetailsDescriptorProps &
  PreferredAlertPropsForForm &
  Pick<SalesDetailsFormProps, "onUpdateSalesDetails">;

export type SalesDetailsFormInputs = {
  retailUnitPrice: string;
  totalPieces: string;
  numberOfBoxes: string;
};

export type SalesDetailsFormProps = {
  selectedItem: PurchaseSupply;
  onUpdateSalesDetails: (
    data: Pick<
      PurchaseSupply,
      "retailUnitPrice" | "totalPieces" | "id" | "numberOfBoxes"
    >,
  ) => void;
} & Required<PurchaseDetailsDescriptorProps> &
  PreferredAlertPropsForForm;

export type PurchaseWholesaleDetailsProps = Pick<
  PurchaseDetailsSuppliesProps,
  "activeAction"
> &
  Pick<SalesDetailsFormProps, "selectedItem"> &
  Required<PurchaseDetailsDescriptorProps> &
  PreferredAlertPropsForForm &
  Pick<PurchaseWholesalePriceFormProps, "onUpdateWholePrices">;

export type PurchaseWholesalePriceFormInputs = {
  quantity: string;
  price: string;
};

export type PurchaseWholesaleFormAction = "add" | "edit";
export type PurchaseWholesalePriceFormProps = {
  purchaseId: string;
  purchaseItemId: number;
  preferredAction: PurchaseWholesaleFormAction;
  selectedWholesaleDetails?: WholesalePrice;
  onUpdateWholePrices: (
    selectedSupplyId: number,
    data: WholesalePrice,
    wholesaleDetailId?: number,
  ) => void;
  onClearSelectedWholesalePrice: VoidFunction;
} & Pick<PreferredAlertPropsForForm, "onSetAlertDetails">;

export type PurchaseMiscPriceFormInputs = {
  name: string;
  amount: string;
};

export type PurchaseMiscPriceFormProps = {
  purchase: Purchase;
  selectedItem?: PurchaseMiscPrice;
} & PreferredAlertPropsForForm &
  Pick<PurchaseDetailsMiscsProps, "onUpdateMiscPriceDetails" | "activeAction">;

export type PurchaseDetailsMiscsProps = {
  onUpdateMiscPriceDetails: (data?: PurchaseMiscPrice, id?: number) => void;
} & Required<PurchaseDetailsDescriptorProps> &
  Pick<
    PurchaseDetailsSuppliesProps,
    "pathname" | "activeAction" | "onNavigate"
  > &
  PreferredAlertPropsForForm;

export type PurchaseStatusFormProps = {
  purchaseId: string;
  currentStatus: PurchaseStatus;
  onChangeStatus: (status: PurchaseStatus) => void;
} & PreferredAlertPropsForForm;
