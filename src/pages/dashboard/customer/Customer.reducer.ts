import type { Customer, PhoneWithID } from "@/utils/types.utils";

type CustomerState = {
  isFetched: boolean;
  count: number;
  data: Array<Customer>;
};

export type CustomerActionType =
  | { type: "load"; payload: Omit<CustomerState, "isFetched"> }
  | { type: "add"; payload: { data: Customer; perPage: number } }
  | { type: "edit"; payload: { data: Customer; id: number } }
  | {
      type: "add-phone";
      payload: { data: PhoneWithID; customerId: number };
    }
  | {
      type: "edit-phone";
      payload: { data: PhoneWithID; customerId: number; phoneId: number };
    }
  | {
      type: "delete-phone";
      payload: { customerId: number; phoneId: number };
    }
  | {
      type: "import";
      payload: { data: Array<Customer>; perPage: number };
    };

export const initialCustomerReducerState: CustomerState = {
  isFetched: false,
  count: 0,
  data: [],
};

export function customerReducer(
  state: CustomerState,
  action: CustomerActionType,
): CustomerState {
  if (action.type === "load") {
    return { ...state, ...action.payload, isFetched: true };
  } else if (action.type === "add") {
    if (state.data.length === 10 && action.payload.perPage === 10) {
      const updatedCustomers = state.data.slice(0, 9);
      updatedCustomers.unshift(action.payload.data);
      return { ...state, data: updatedCustomers, count: state.count + 1 };
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
    const existingCustomerIndex = updatedData.findIndex(
      (item) => item.id === action.payload.customerId,
    );
    const updatedCustomer = { ...updatedData[existingCustomerIndex] };
    const updatedCustomerPhones = [...updatedCustomer.customerPhones];
    updatedCustomerPhones.push(action.payload.data);
    updatedCustomer.customerPhones = updatedCustomerPhones;
    updatedData[existingCustomerIndex] = updatedCustomer;
    return { ...state, data: [...updatedData] };
  } else if (action.type === "edit-phone") {
    const updatedData = [...state.data];
    const existingCustomerIndex = updatedData.findIndex(
      (item) => item.id === action.payload.customerId,
    );
    const updatedCustomer = { ...updatedData[existingCustomerIndex] };
    const updatedCustomerPhones = [...updatedCustomer.customerPhones];
    const preferredCustomerPhoneIndex = updatedCustomerPhones.findIndex(
      (item) => item.id === action.payload.phoneId,
    );
    updatedCustomerPhones[preferredCustomerPhoneIndex] = action.payload.data;
    updatedCustomer.customerPhones = updatedCustomerPhones;
    updatedData[existingCustomerIndex] = updatedCustomer;
    return { ...state, data: [...updatedData] };
  } else if (action.type === "delete-phone") {
    const updatedData = [...state.data];
    const existingCustomerIndex = updatedData.findIndex(
      (item) => item.id === action.payload.customerId,
    );
    const updatedCustomer = { ...updatedData[existingCustomerIndex] };
    updatedCustomer.customerPhones = updatedCustomer.customerPhones.filter(
      (item) => item.id !== action.payload.phoneId,
    );
    const deleteCount = 1;
    updatedData.splice(existingCustomerIndex, deleteCount, updatedCustomer);
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

  throw new Error("Unrecognized customer action type");
}
