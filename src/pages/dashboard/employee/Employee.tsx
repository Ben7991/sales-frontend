import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { BiSolidEdit } from "react-icons/bi";

import { Alert } from "@/components/molecules/alert/Alert";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import type { User } from "@/utils/types.utils";
import { Modal } from "@/components/organisms/modal/Modal";
import {
  EmployeeForm,
  EmployeeStatusForm,
  EmployeeSubHeader,
} from "./Employee.partials";
import {
  getPaginatedData,
  makeFirstLetterUppercase,
} from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import {
  employeeDataTableColumnHeadings,
  formatRole,
  getEmployees,
} from "./Employee.utils";
import {
  employeeReducer,
  initialEmployeeReducerState,
} from "./Employee.reducer";

export function Employee(): React.JSX.Element {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isFetching, setIsFetching] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User>();
  const [employeeState, employeeDispatch] = useReducer(
    employeeReducer,
    initialEmployeeReducerState,
  );

  const {
    state: alertState,
    alertDetails,
    showAlert,
    hideAlert,
    setAlertDetails,
  } = useAlert();

  const { page, perPage, query } = getPaginatedData(searchParams);

  useEffect(() => {
    const fetchEmployees = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getEmployees(query, page, perPage);
        employeeDispatch({
          type: "load",
          payload: result,
        });
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchEmployees();
  }, [query, page, perPage]);

  const handleHideModal = (): void => {
    navigate(pathname);
  };

  const handleSelectionAndEdit = (
    id: number,
    action: "edit" | "change-status",
  ) => {
    const preferredCustomer = employeeState.data.find((item) => item.id === id);

    if (!preferredCustomer) return;

    setSelectedEmployee(preferredCustomer);
    navigate(`${pathname}?action=${action}`);
  };

  const activeAction = searchParams.get("action") as
    | "add"
    | "edit"
    | "change-status"
    | undefined;

  return (
    <>
      {alertState ? (
        <Alert
          variant={alertDetails?.variant ?? "error"}
          message={alertDetails?.message ?? ""}
          onHide={hideAlert}
        />
      ) : null}
      <EmployeeSubHeader
        isFetching={isFetching}
        pathname={pathname}
        page={page}
        perPage={perPage}
        onResetSelectedEmployee={() => setSelectedEmployee(undefined)}
      />
      <DataTable
        count={employeeState.count}
        columnHeadings={employeeDataTableColumnHeadings}
      >
        {employeeState.data.map((item) => (
          <tr key={item.id}>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.username}</td>
            <td>{formatRole(item.role)}</td>
            <td>
              <span
                className={`py-1 px-2 text-[0.80rem] rounded-full ${item.status === "ACTIVE" ? "text-green-700 bg-green-200" : item.status === "FIRED" ? "text-red-700 bg-red-200" : "text-gray-600 bg-gray-200"}`}
              >
                {item.status}
              </span>
            </td>
            <td>
              <DataTable.Actions>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => handleSelectionAndEdit(item.id, "edit")}
                >
                  <BiSolidEdit className="text-xl" />
                  <span>Edit Employee</span>
                </DataTable.Action>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() =>
                    handleSelectionAndEdit(item.id, "change-status")
                  }
                >
                  <BiSolidEdit className="text-xl" />
                  <span>Change Status</span>
                </DataTable.Action>
              </DataTable.Actions>
            </td>
          </tr>
        ))}
      </DataTable>
      <Modal
        title={`${makeFirstLetterUppercase(activeAction)} Employee`}
        show={Boolean(activeAction)}
        onHide={handleHideModal}
      >
        {["add", "edit"].includes(activeAction as string) ? (
          <EmployeeForm
            perPage={perPage}
            selectedEmployee={selectedEmployee}
            onResetSelectedEmployee={() => setSelectedEmployee(undefined)}
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onShowAlert={showAlert}
            onEmployeeDispatch={employeeDispatch}
          />
        ) : (
          <EmployeeStatusForm
            selectedEmployee={selectedEmployee}
            onResetSelectedEmployee={() => setSelectedEmployee(undefined)}
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onShowAlert={showAlert}
            onEmployeeDispatch={employeeDispatch}
          />
        )}
      </Modal>
    </>
  );
}
