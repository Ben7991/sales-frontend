import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { BiSolidEdit } from "react-icons/bi";

import { Alert } from "@/components/molecules/alert/Alert";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import type { ResponseWithRecord, User } from "@/utils/types.utils";
import { Modal } from "@/components/organisms/modal/Modal";
import {
  AddEmployeeForm,
  EmployeeStatusForm,
  EmployeeSubHeader,
  UpdateEmployeeForm,
} from "./Employee.partials";
import {
  getPaginatedData,
  getSearchParamsForPaginator,
  makeFirstLetterUppercase,
} from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { employeeDataTableColumnHeadings, formatRole } from "./Employee.utils";
import {
  employeeReducer,
  initialEmployeeReducerState,
} from "./Employee.reducer";
import { useFetch } from "@/utils/hooks.utils";
import { Pill } from "@/components/atoms/pill/Pill";
import { get } from "@/utils/http.utils";

export default function Employee(): React.JSX.Element {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isFetching, setIsFetching } = useFetch();
  const [selectedEmployee, setSelectedEmployee] = useState<User>();
  const [employeeState, employeeDispatch] = useReducer(
    employeeReducer,
    initialEmployeeReducerState,
  );

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const { page, perPage, query } = getPaginatedData(searchParams);

  useEffect(() => {
    const fetchEmployees = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const searchParams = getSearchParamsForPaginator(query, page, perPage);
        const result = await get<ResponseWithRecord<User>>(
          `users?${searchParams.toString()}`,
        );
        employeeDispatch({
          type: "load",
          payload: result,
        });
      } catch (error) {
        console.error("Failed to fetch employees", error);
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchEmployees();
  }, [query, page, perPage, setIsFetching, setAlertDetails]);

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
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
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
              <Pill
                text={item.status}
                variant={
                  item.status === "ACTIVE"
                    ? "success"
                    : item.status === "FIRED"
                      ? "danger"
                      : "secondary"
                }
              />
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
        {"add" === activeAction ? (
          <AddEmployeeForm
            perPage={perPage}
            onSetAlertDetails={setAlertDetails}
            onEmployeeDispatch={employeeDispatch}
          />
        ) : activeAction === "edit" ? (
          <UpdateEmployeeForm
            selectedEmployee={selectedEmployee}
            onEmployeeDispatch={employeeDispatch}
            onResetSelectedEmployee={() => setSelectedEmployee(undefined)}
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
          />
        ) : (
          <EmployeeStatusForm
            selectedEmployee={selectedEmployee}
            onResetSelectedEmployee={() => setSelectedEmployee(undefined)}
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onEmployeeDispatch={employeeDispatch}
          />
        )}
      </Modal>
    </>
  );
}
