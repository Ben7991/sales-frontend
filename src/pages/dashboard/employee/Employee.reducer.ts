import type { Employee } from "@/utils/types.utils";

type EmployeeState = {
  count: number;
  data: Array<Employee>;
};

export type EmployeeActionType =
  | { type: "load"; payload: EmployeeState }
  | { type: "add"; payload: { data: Employee; perPage: number } }
  | { type: "edit"; payload: { data: Employee; id: number } };

export const initialEmployeeReducerState: EmployeeState = {
  count: 0,
  data: [],
};

export function employeeReducer(
  state: EmployeeState,
  action: EmployeeActionType,
): EmployeeState {
  if (action.type === "load") {
    return { ...state, ...action.payload };
  } else if (action.type === "add") {
    if (state.data.length === 10 && action.payload.perPage === 10) {
      const updatedEmployees = state.data.slice(0, 9);
      updatedEmployees.unshift(action.payload.data);
      return { ...state, data: updatedEmployees, count: state.count + 1 };
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
  }

  throw new Error("Unrecognized employee action type");
}
