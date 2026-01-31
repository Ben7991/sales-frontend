import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { Button } from "@/components/atoms/button/Button";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuUserRoundPlus } from "react-icons/lu";
import type {
  ActiveTabForPhoneForm,
  Customer,
  PhoneWithID,
} from "@/utils/types.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import { Modal } from "@/components/organisms/modal/Modal";
import {
  CustomerForm,
  CustomerImport,
  CustomerPhoneForm,
} from "./Customer.partials";
import {
  customerDataTableColumnHeadings,
  customerModalHeading,
  getCustomers,
} from "./Customer.utils";
import {
  customerReducer,
  initialCustomerReducerState,
} from "./Customer.reducer";
import { getPaginatedData } from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useFetch } from "@/utils/hooks.utils";

export function Customer(): React.JSX.Element {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isFetching, setIsFetching } = useFetch();
  const [customerState, customerDispatch] = useReducer(
    customerReducer,
    initialCustomerReducerState,
  );

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const [selectedCustomerPhone, setSelectedCustomerPhone] =
    useState<PhoneWithID>();

  const {
    state: alertState,
    alertDetails,
    showAlert,
    hideAlert,
    setAlertDetails,
  } = useAlert();

  const { page, perPage, query } = getPaginatedData(searchParams);

  useEffect(() => {
    const fetchCustomers = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getCustomers(query, page, perPage);
        customerDispatch({
          type: "load",
          payload: result,
        });
      } catch (error) {
        console.error("Failed to fetch suppliers", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCustomers();
  }, [query, page, perPage, setIsFetching]);

  const handleHideModal = (): void => {
    navigate(pathname);
  };

  const handleSelectionAndEdit = (id: number, action: "edit" | "add-phone") => {
    const preferredCustomer = customerState.data.find((item) => item.id === id);

    if (!preferredCustomer) return;

    setSelectedCustomer(preferredCustomer);
    navigate(`${pathname}?action=${action}`);
  };

  const handlePhoneSelectionAndEdit = (
    supplierId: number,
    phoneId: number,
    action: ActiveTabForPhoneForm,
  ) => {
    const preferredCustomer = customerState.data.find(
      (item) => item.id === supplierId,
    );

    if (!preferredCustomer) return;

    const preferredSupplierPhone = preferredCustomer.customerPhones.find(
      (item) => item.id === phoneId,
    );

    if (!preferredSupplierPhone) return;

    setSelectedCustomerPhone(preferredSupplierPhone);
    setSelectedCustomer(preferredCustomer);
    navigate(`${pathname}?action=${action}`);
  };

  const activeAction = searchParams.get("action") as
    | "add"
    | "edit"
    | "delete"
    | "add-phone"
    | "edit-phone"
    | "delete-phone"
    | "import"
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
      <PageDescriptor title="Customers" spinnerState={isFetching}>
        <div className="flex items-center gap-2">
          <Button
            el="link"
            to={`${pathname}?action=add`}
            variant="primary"
            className="flex! items-center gap-2"
            onClick={() => setSelectedCustomer(undefined)}
          >
            <LuUserRoundPlus />
            <span>Add Customer</span>
          </Button>
          <Button
            el="link"
            to={`${pathname}?action=import`}
            variant="outline"
            className="flex! items-center gap-2"
          >
            <IoCloudUploadOutline />
            <span>Import Customers</span>
          </Button>
        </div>
      </PageDescriptor>
      <DataTable
        count={customerState.count}
        columnHeadings={customerDataTableColumnHeadings}
      >
        {customerState.data.map((item) => (
          <tr key={item.id}>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>{item.name}</td>
            <td>{item.address || "-"}</td>
            <td>
              <DataTable.DataList
                list={item.customerPhones.map((data) => ({
                  id: data.id,
                  data: data.phone,
                }))}
              >
                {item.customerPhones.map((data) => (
                  <div
                    className="flex items-center justify-between"
                    key={data.id}
                  >
                    <p>{data.phone}</p>
                    <div className="flex items-center">
                      <DataTable.Action
                        className="hover:bg-gray-100 text-gray-500 w-fit! p-2!"
                        onClick={() =>
                          handlePhoneSelectionAndEdit(
                            item.id,
                            data.id,
                            "edit-phone",
                          )
                        }
                        title="Edit Customer Phone"
                      >
                        <FaRegEdit className="text-xl" />
                      </DataTable.Action>
                      <DataTable.Action
                        className="hover:bg-gray-100 text-red-500 w-fit! p-2!"
                        onClick={() =>
                          handlePhoneSelectionAndEdit(
                            item.id,
                            data.id,
                            "delete-phone",
                          )
                        }
                        title="Delete"
                      >
                        <BsTrash className="text-xl" />
                      </DataTable.Action>
                    </div>
                  </div>
                ))}
              </DataTable.DataList>
            </td>
            <td>
              <DataTable.Actions>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => handleSelectionAndEdit(item.id, "edit")}
                >
                  <BiSolidEdit className="text-xl" />
                  <span>Edit Customer</span>
                </DataTable.Action>
                <DataTable.Action
                  className="hover:bg-gray-100"
                  onClick={() => handleSelectionAndEdit(item.id, "add-phone")}
                >
                  <MdOutlineAddCircleOutline className="text-xl" />
                  <span>Add Phone</span>
                </DataTable.Action>
              </DataTable.Actions>
            </td>
          </tr>
        ))}
      </DataTable>
      <Modal
        title={customerModalHeading[activeAction as string]}
        show={Boolean(activeAction)}
        onHide={handleHideModal}
      >
        {activeAction?.includes("phone") ? (
          <CustomerPhoneForm
            selectedCustomer={selectedCustomer}
            selectedCustomerPhone={selectedCustomerPhone}
            onResetSelectedCustomerPhone={() =>
              setSelectedCustomerPhone(undefined)
            }
            onCustomerDispatch={customerDispatch}
            onShowAlert={showAlert}
            onSetAlertDetails={setAlertDetails}
            onHideModal={handleHideModal}
            activeTab={activeAction as ActiveTabForPhoneForm}
          />
        ) : activeAction === "import" ? (
          <CustomerImport
            onCustomerDispatch={customerDispatch}
            perPage={perPage}
          />
        ) : (
          <CustomerForm
            perPage={perPage}
            selectedCustomer={selectedCustomer}
            onResetSelectedCustomer={() => setSelectedCustomer(undefined)}
            onShowAlert={showAlert}
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onCustomerDispatch={customerDispatch}
          />
        )}
      </Modal>
    </>
  );
}
