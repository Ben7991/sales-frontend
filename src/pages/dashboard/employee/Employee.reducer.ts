import type { User, UserStatus } from "@/utils/types.utils";

type UserState = {
  count: number;
  data: Array<User>;
};

export type UserActionType =
  | { type: "load"; payload: UserState }
  | { type: "add"; payload: { data: User; perPage: number } }
  | { type: "edit"; payload: { data: User; id: number } }
  | { type: "change-status"; payload: { data: UserStatus; id: number } };

export const initialEmployeeReducerState: UserState = {
  count: 0,
  data: [],
};

export function employeeReducer(
  state: UserState,
  action: UserActionType,
): UserState {
  if (action.type === "load") {
    return { ...state, ...action.payload };
  } else if (action.type === "add") {
    if (state.data.length === 10 && action.payload.perPage === 10) {
      const updatedUsers = state.data.slice(0, 9);
      updatedUsers.unshift(action.payload.data);
      return { ...state, data: updatedUsers, count: state.count + 1 };
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
  } else if (action.type === "change-status") {
    const updatedData = [...state.data];
    const existingDataIndex = updatedData.findIndex(
      (item) => item.id === action.payload.id,
    );
    const updatedUser = { ...updatedData[existingDataIndex] };
    updatedUser.status = action.payload.data;
    const deleteCount = 1;
    updatedData.splice(existingDataIndex, deleteCount, updatedUser);
    return { ...state, data: [...updatedData], count: state.count + 1 };
  }

  throw new Error("Unrecognized employee action type");
}
