import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { LuUserRoundPlus } from "react-icons/lu";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BiSolidEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import { Modal } from "@/components/organisms/modal/Modal";
import {
  SupplierForm,
  SupplierImport,
  SupplierPhoneForm,
} from "./Supplier.partials";
import { Button } from "@/components/atoms/button/Button";
import { getPaginatedData } from "@/utils/helpers.utils";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import {
  getSuppliers,
  supplierDataTableColumnHeadings,
  supplierModalHeading,
} from "./Supplier.utils";
import {
  initialSupplierReducerState,
  supplierReducer,
} from "./Supplier.reducer";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import type {
  ActiveTabForPhoneForm,
  PhoneWithID,
  Supplier,
} from "@/utils/types.utils";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useFetch } from "@/utils/hooks.utils";
import { useAppSelector } from "@/store/index.util";

export function Supplier(): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isFetching, setIsFetching } = useFetch();
  const [supplierState, supplierDispatch] = useReducer(
    supplierReducer,
    initialSupplierReducerState,
  );

  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
  const [selectedSupplierPhone, setSelectedSupplierPhone] =
    useState<PhoneWithID>();

  const { page, perPage, query } = getPaginatedData(searchParams);

  useEffect(() => {
    const fetchSuppliers = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getSuppliers(query, page, perPage);
        supplierDispatch({
          type: "load",
          payload: result,
        });
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch suppliers", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSuppliers();
  }, [query, page, perPage, setIsFetching, setAlertDetails]);

  const handleHideModal = (): void => {
    navigate(pathname);
  };

  const handleSelectionAndEdit = (id: number, action: "edit" | "add-phone") => {
    const preferredSupplier = supplierState.data.find((item) => item.id === id);

    if (!preferredSupplier) return;

    setSelectedSupplier(preferredSupplier);
    navigate(`${pathname}?action=${action}`);
  };

  const handlePhoneSelectionAndEdit = (
    supplierId: number,
    phoneId: number,
    action: ActiveTabForPhoneForm,
  ) => {
    const preferredSupplier = supplierState.data.find(
      (item) => item.id === supplierId,
    );

    if (!preferredSupplier) return;

    const preferredSupplierPhone = preferredSupplier.supplierPhones.find(
      (item) => item.id === phoneId,
    );

    if (!preferredSupplierPhone) return;

    setSelectedSupplierPhone(preferredSupplierPhone);
    setSelectedSupplier(preferredSupplier);
    navigate(`${pathname}?action=${action}`);
  };

  const activeAction = searchParams.get("action") as
    | "add"
    | "edit"
    | "delete"
    | "import"
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
      <PageDescriptor title="Suppliers" spinnerState={isFetching}>
        {user?.role === "ADMIN" ? (
          <div className="flex items-center gap-2">
            <Button
              el="link"
              to={`${pathname}?action=add`}
              variant="primary"
              className="flex! items-center gap-2"
              onClick={() => setSelectedSupplier(undefined)}
            >
              <LuUserRoundPlus />
              <span>Add Supplier</span>
            </Button>
            <Button
              el="link"
              to={`${pathname}?action=import`}
              variant="outline"
              className="flex! items-center gap-2"
            >
              <IoCloudUploadOutline />
              <span>Import Suppliers</span>
            </Button>
          </div>
        ) : null}
      </PageDescriptor>
      <DataTable
        count={supplierState.count}
        columnHeadings={
          user?.role === "PROCUREMENT_OFFICER"
            ? supplierDataTableColumnHeadings
            : [...supplierDataTableColumnHeadings, ""]
        }
      >
        {supplierState.data.map((item) => (
          <tr key={item.id}>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>{item.name}</td>
            <td>{item.email || "-"}</td>
            <td>{item.companyName || "-"}</td>
            <td>
              <DataTable.DataList
                list={item.supplierPhones.map((data) => ({
                  id: data.id,
                  data: data.phone,
                }))}
              >
                {item.supplierPhones.map((data) => (
                  <div
                    className="flex items-center justify-between"
                    key={data.id}
                  >
                    <p>{data.phone}</p>
                    {user?.role === "ADMIN" ? (
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
                          title="Edit"
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
                    ) : null}
                  </div>
                ))}
              </DataTable.DataList>
            </td>
            {user?.role === "ADMIN" ? (
              <td>
                <DataTable.Actions>
                  <DataTable.Action
                    className="hover:bg-gray-100"
                    onClick={() => handleSelectionAndEdit(item.id, "edit")}
                  >
                    <BiSolidEdit className="text-xl" />
                    <span>Edit supplier</span>
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
            ) : null}
          </tr>
        ))}
      </DataTable>
      <Modal
        title={supplierModalHeading[activeAction as string]}
        show={Boolean(activeAction)}
        onHide={handleHideModal}
      >
        {activeAction?.includes("phone") ? (
          <SupplierPhoneForm
            selectedSupplier={selectedSupplier}
            selectedSupplierPhone={selectedSupplierPhone}
            onResetSelectedSupplierPhone={() =>
              setSelectedSupplierPhone(undefined)
            }
            onSupplierDispatch={supplierDispatch}
            onSetAlertDetails={setAlertDetails}
            onHideModal={handleHideModal}
            activeTab={activeAction as ActiveTabForPhoneForm}
          />
        ) : activeAction === "import" ? (
          <SupplierImport
            onSupplierDispatch={supplierDispatch}
            perPage={perPage}
          />
        ) : (
          <SupplierForm
            perPage={perPage}
            selectedSupplier={selectedSupplier}
            onResetSelectedSupplier={() => setSelectedSupplier(undefined)}
            onHideModal={handleHideModal}
            onSetAlertDetails={setAlertDetails}
            onSupplierDispatch={supplierDispatch}
          />
        )}
      </Modal>
    </>
  );
}
