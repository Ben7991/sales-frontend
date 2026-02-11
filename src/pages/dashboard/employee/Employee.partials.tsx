import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { Link } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosSave } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import type { ResponseWithDataAndMessage, User } from "@/utils/types.utils";
import {
  addEmployee,
  changeStatus,
  editEmployee,
  employeeSchema,
} from "./Employee.utils";
import type {
  EmployeeFormProps,
  EmployeeInputs,
  EmployeeSubHeaderProps,
} from "./Employee.types";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { LuUserRoundPlus } from "react-icons/lu";
import { MdFilterList } from "react-icons/md";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { useOutsideClick } from "@/utils/hooks.utils";
import { makeFirstLetterUppercase } from "@/utils/helpers.utils";

export function EmployeeForm({
  perPage,
  selectedEmployee,
  onResetSelectedEmployee,
  onHideModal,
  onSetAlertDetails,
  onEmployeeDispatch,
}: EmployeeFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);
  const [userRole, setUserRole] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmployeeInputs>({
    resolver: yupResolver(employeeSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setValue("name", selectedEmployee.name);
      setValue("email", selectedEmployee.email);
      setValue("username", selectedEmployee.username);
      setUserRole(
        selectedEmployee.role === "PROCUREMENT_OFFICER"
          ? "Procurement Officer"
          : "Sales Person",
      );
    }
  }, [selectedEmployee, setValue]);

  const onSubmit: SubmitHandler<EmployeeInputs> = async (
    data,
  ): Promise<void> => {
    if (!userRole) {
      setDropdownError(true);
      return;
    }

    setIsLoading(true);

    let result: ResponseWithDataAndMessage<User>;
    const role = userRole.startsWith("Procurement")
      ? "PROCUREMENT_OFFICER"
      : "SALES_PERSON";

    try {
      if (selectedEmployee) {
        result = await editEmployee({ ...data, role }, selectedEmployee.id);
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        onEmployeeDispatch({
          type: "edit",
          payload: {
            id: selectedEmployee.id,
            data: result.data,
          },
        });
        onResetSelectedEmployee();
        onHideModal();
      } else {
        result = await addEmployee({ ...data, role });
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        onEmployeeDispatch({
          type: "add",
          payload: {
            data: result.data,
            perPage,
          },
        });
      }
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to add employee", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          {...register("name")}
          hasError={Boolean(errors.name)}
          autoFocus
        />
        {Boolean(errors.name) && (
          <Form.Error>{errors.name?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          id="email"
          {...register("email")}
          hasError={Boolean(errors.email)}
        />
        {Boolean(errors.email) && (
          <Form.Error>{errors.email?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          type="text"
          id="username"
          {...register("username")}
          hasError={Boolean(errors.username)}
        />
        {Boolean(errors.username) && (
          <Form.Error>{errors.username?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="name">Role</Form.Label>
        <Form.Dropdown
          placeholder="Select an employee role"
          list={["Procurement Officer", "Sales Person"]}
          onSelectItem={
            setUserRole as Dispatch<SetStateAction<string | undefined>>
          }
          selectedItem={userRole}
          hasError={dropdownError}
          onHideError={() => setDropdownError(false)}
        />
        {dropdownError && <Form.Error>Role is required</Form.Error>}
      </Form.Group>
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>
                {selectedEmployee ? "Save changes" : "Save new employee"}
              </span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function EmployeeStatusForm({
  selectedEmployee,
  onResetSelectedEmployee,
  onHideModal,
  onSetAlertDetails,
  onEmployeeDispatch,
}: Omit<EmployeeFormProps, "perPage">): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);
  const [status, setStatus] = useState<string>();

  useEffect(() => {
    if (selectedEmployee) {
      setStatus(
        makeFirstLetterUppercase(selectedEmployee.status.toLowerCase()),
      );
    }
  }, [selectedEmployee]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!status) {
      setDropdownError(true);
      return;
    }

    if (!selectedEmployee) {
      return;
    }

    setIsLoading(true);

    const formattedStatus =
      status === "Active" ? "ACTIVE" : status === "Fired" ? "FIRED" : "QUIT";

    try {
      const result = await changeStatus(
        { status: formattedStatus },
        selectedEmployee.id,
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onEmployeeDispatch({
        type: "change-status",
        payload: {
          id: selectedEmployee.id,
          data: formattedStatus,
        },
      });
      onResetSelectedEmployee();
      onHideModal();
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to change employee status", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-4">
        <Form.Label htmlFor="status">Status</Form.Label>
        <Form.Dropdown
          placeholder="Select employee status"
          list={["Active", "Fired", "Quit"]}
          onSelectItem={
            setStatus as Dispatch<SetStateAction<string | undefined>>
          }
          selectedItem={status}
          hasError={dropdownError}
          onHideError={() => setDropdownError(false)}
        />
        {dropdownError && <Form.Error>Status is required</Form.Error>}
      </Form.Group>
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>Change status</span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function EmployeeSubHeader({
  isFetching,
  pathname,
  page,
  perPage,
  onResetSelectedEmployee,
}: EmployeeSubHeaderProps): React.JSX.Element {
  const [showFilterList, setShowFilterList] = useState(false);

  const handleOutsideClick = useCallback(() => {
    setShowFilterList(false);
  }, []);

  useOutsideClick(handleOutsideClick);

  const toggleFilterList = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setShowFilterList((prevState) => !prevState);
  };

  return (
    <PageDescriptor title="Employees" spinnerState={isFetching}>
      <div className="flex items-center gap-2">
        <Button
          el="link"
          to={`${pathname}?action=add`}
          variant="primary"
          className="flex! items-center gap-2"
          onClick={onResetSelectedEmployee}
        >
          <LuUserRoundPlus />
          <span>Add Employee</span>
        </Button>
        <div className="relative">
          <Button
            el="button"
            variant="outline"
            className="flex! items-center justify-between gap-3"
            onClick={toggleFilterList}
          >
            <span className="flex items-center gap-2">
              <MdFilterList />
              <span>Filter</span>
            </span>
            {showFilterList ? (
              <RxCaretUp className="text-xl" />
            ) : (
              <RxCaretDown className="text-xl" />
            )}
          </Button>
          <AnimatePresence>
            {showFilterList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute right-0 top-12 bg-white border border-gray-100 shadow-md rounded-md w-50 py-2 z-10"
              >
                <Link
                  to={`${pathname}?page=${page}&perPage=${perPage}`}
                  className="block w-full hover:bg-gray-100 px-3 py-1.5 text-start"
                >
                  All Roles
                </Link>
                <Link
                  to={`${pathname}?page=${page}&perPage=${perPage}&q=PROCUREMENT_OFFICER`}
                  className="block w-full hover:bg-gray-100 px-3 py-1.5 text-start"
                >
                  Procurement Officer
                </Link>
                <Link
                  to={`${pathname}?page=${page}&perPage=${perPage}&q=SALES_PERSON`}
                  className="block w-full hover:bg-gray-100 px-3 py-1.5 text-start"
                >
                  Sales Person
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageDescriptor>
  );
}
