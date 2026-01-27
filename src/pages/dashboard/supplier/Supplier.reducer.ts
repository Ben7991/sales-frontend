import type { PhoneWithID, Supplier } from "@/utils/types.utils";

type SupplierState = {
  isFetched: boolean;
  count: number;
  data: Array<Supplier>;
};

export type SupplierActionType =
  | { type: "load"; payload: Omit<SupplierState, "isFetched"> }
  | { type: "add"; payload: { data: Supplier; perPage: number } }
  | { type: "edit"; payload: { data: Supplier; id: number } }
  | {
      type: "add-phone";
      payload: { data: PhoneWithID; supplierId: number };
    }
  | {
      type: "edit-phone";
      payload: { data: PhoneWithID; supplierId: number; phoneId: number };
    }
  | {
      type: "delete-phone";
      payload: { supplierId: number; phoneId: number };
    }
  | {
      type: "import";
      payload: { data: Array<Supplier>; perPage: number };
    };

export const initialSupplierReducerState: SupplierState = {
  isFetched: false,
  count: 0,
  data: [],
};

export function supplierReducer(
  state: SupplierState,
  action: SupplierActionType,
): SupplierState {
  if (action.type === "load") {
    return { ...state, ...action.payload, isFetched: true };
  } else if (action.type === "add") {
    if (state.data.length === 10 && action.payload.perPage === 10) {
      const updatedSuppliers = state.data.slice(0, 9);
      updatedSuppliers.unshift(action.payload.data);
      return { ...state, data: updatedSuppliers, count: state.count + 1 };
    }
    return { ...state, data: [action.payload.data, ...state.data] };
  } else if (action.type === "edit") {
    const updatedData = [...state.data];
    const existingDataIndex = updatedData.findIndex(
      (item) => item.id === action.payload.id,
    );
    const deleteCount = 1;
    updatedData.splice(existingDataIndex, deleteCount, action.payload.data);
    return { ...state, data: [...updatedData], count: state.count + 1 };
  } else if (action.type === "add-phone") {
    const updatedData = [...state.data];
    const existingSupplierIndex = updatedData.findIndex(
      (item) => item.id === action.payload.supplierId,
    );
    const updatedSupplier = { ...updatedData[existingSupplierIndex] };
    const updatedSupplierPhones = [...updatedSupplier.supplierPhones];
    updatedSupplierPhones.push(action.payload.data);
    updatedSupplier.supplierPhones = updatedSupplierPhones;
    updatedData[existingSupplierIndex] = updatedSupplier;
    return { ...state, data: [...updatedData] };
  } else if (action.type === "edit-phone") {
    const updatedData = [...state.data];
    const existingSupplierIndex = updatedData.findIndex(
      (item) => item.id === action.payload.supplierId,
    );
    const updatedSupplier = { ...updatedData[existingSupplierIndex] };
    const updatedSupplierPhones = [...updatedSupplier.supplierPhones];
    const preferredSupplierPhoneIndex = updatedSupplierPhones.findIndex(
      (item) => item.id === action.payload.phoneId,
    );
    updatedSupplierPhones[preferredSupplierPhoneIndex] = action.payload.data;
    updatedSupplier.supplierPhones = updatedSupplierPhones;
    updatedData[existingSupplierIndex] = updatedSupplier;
    return { ...state, data: [...updatedData] };
  } else if (action.type === "delete-phone") {
    const updatedData = [...state.data];
    const existingSupplierIndex = updatedData.findIndex(
      (item) => item.id === action.payload.supplierId,
    );
    const updatedSupplier = { ...updatedData[existingSupplierIndex] };
    updatedSupplier.supplierPhones = updatedSupplier.supplierPhones.filter(
      (item) => item.id !== action.payload.phoneId,
    );
    const deleteCount = 1;
    updatedData.splice(existingSupplierIndex, deleteCount, updatedSupplier);
    return { ...state, data: [...updatedData] };
  } else if (action.type === "import") {
    const updatedData = [...state.data];
    let removalCountBeforeAddition = 0;
    if (action.payload.data.length >= action.payload.perPage) {
      removalCountBeforeAddition =
        state.data.length === action.payload.perPage
          ? action.payload.perPage
          : state.data.length;
    } else if (
      state.data.length === action.payload.perPage &&
      action.payload.data.length < action.payload.perPage
    ) {
      removalCountBeforeAddition = action.payload.data.length;
    } else if (state.data.length > action.payload.data.length) {
      removalCountBeforeAddition =
        state.data.length - action.payload.data.length;
    } else if (action.payload.data.length > state.data.length) {
      const payloadPerpageDifferenceCount =
        action.payload.perPage - action.payload.data.length;
      removalCountBeforeAddition =
        state.data.length - payloadPerpageDifferenceCount;
    }

    for (let i = 0; i < removalCountBeforeAddition; i++) {
      updatedData.pop();
    }

    return {
      ...state,
      data: [...action.payload.data, ...updatedData],
      count: state.count + action.payload.data.length,
    };
  }

  throw new Error("No undefines are allowed");
}
