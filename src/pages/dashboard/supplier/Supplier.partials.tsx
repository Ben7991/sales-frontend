import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "motion/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosSave } from "react-icons/io";
import { LuDownload } from "react-icons/lu";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import {
  addSupplier,
  editSupplier,
  addSupplierPhone,
  editSupplierPhone,
  removeSupplierPhone,
  supplierPhoneSchema,
  supplierSchema,
  importSuppliers,
} from "./Supplier.utils";
import type {
  SupplierFormProps,
  SupplierImportProps,
  SupplierInputs,
  SupplierPhoneFormProps,
  SupplierPhoneInput,
} from "./Supplier.types";
import type {
  DataWithID,
  PhoneWithID,
  ResponseWithDataAndMessage,
  Supplier,
} from "@/utils/types.utils";
import { CgDanger } from "react-icons/cg";
import { Headline } from "@/components/atoms/headline/Headline";
import { RxUpload } from "react-icons/rx";
import { Spinner } from "@/components/atoms/spinner/Spinner";
import type { AlertProps } from "@/components/molecules/alert/Alert.types";
import { LiaTimesSolid } from "react-icons/lia";

export function SupplierForm({
  perPage,
  selectedSupplier,
  onResetSelectedSupplier,
  onSupplierDispatch,
  onShowAlert,
  onHideModal,
  onSetAlertDetails,
}: SupplierFormProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(supplierSchema),
  });
  const [phones, setPhones] = useState<Supplier["supplierPhones"]>([
    { id: 1, phone: "" },
  ]);

  useEffect((): void => {
    if (selectedSupplier) {
      setValue("name", selectedSupplier.name);
      setValue("email", selectedSupplier.email);
      setValue("companyName", selectedSupplier.companyName);
      setPhones(selectedSupplier.supplierPhones);
    }
  }, [selectedSupplier, setValue]);

  const addPhoneField = (): void => {
    const updatedPhones = [...phones];
    updatedPhones.push({
      id: updatedPhones.length + 1,
      phone: "",
    });
    setPhones(updatedPhones);
  };

  const removeAddedPhoneField = (id: number): void => {
    setPhones((prevPhones) => prevPhones.filter((item) => item.id !== id));
  };

  const updatedList = (list: Array<DataWithID>): void => {
    setPhones(list.map((item) => ({ id: item.id, phone: item.data })));
  };

  const onSubmit: SubmitHandler<SupplierInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);
    let result: ResponseWithDataAndMessage<Supplier> | undefined;

    try {
      if (!selectedSupplier) {
        result = await addSupplier({
          ...data,
          phones: phones
            .filter((item) => item.phone !== "")
            .map((item) => item.phone),
        });
        onSupplierDispatch({
          type: "add",
          payload: {
            data: result.data,
            perPage,
          },
        });
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        reset();
        setPhones([]);
      } else {
        result = await editSupplier(data, selectedSupplier.id);
        onSupplierDispatch({
          type: "edit",
          payload: {
            data: result.data,
            id: selectedSupplier.id,
          },
        });
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        reset();
        onResetSelectedSupplier();
        onHideModal();
      }
    } catch (error) {
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to add supplier", error);
    } finally {
      onShowAlert();
      setIsLoading(false);
    }
  };

  return (
    <>
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
        <Form.Group className={`${selectedSupplier ? "hidden" : "mb-4"}`}>
          <Form.Label htmlFor="phones" className="flex! gap-2">
            Phones
            <button
              type="button"
              title="Click to add new phone input field"
              onClick={addPhoneField}
            >
              <IoAddCircleOutline className="text-xl" />
            </button>
          </Form.Label>
          <Form.ControlArray
            list={phones.map((item) => ({ id: item.id, data: item.phone }))}
            onUpdateList={updatedList}
            onRemoveItem={removeAddedPhoneField}
          />
        </Form.Group>
        <Form.Group className="mb-7">
          <Form.Label htmlFor="company_name">Company Name</Form.Label>
          <Form.Control
            type="text"
            id="company_name"
            {...register("companyName")}
            hasError={Boolean(errors.companyName)}
          />
          {Boolean(errors.companyName) && (
            <Form.Error>{errors.companyName?.message}</Form.Error>
          )}
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
                <span>Save New Supplier</span>
              </span>
            )}
          </Button>
        </Form.Group>
      </Form>
    </>
  );
}

export function SupplierPhoneForm({
  activeTab,
  selectedSupplier,
  selectedSupplierPhone,
  onShowAlert,
  onHideModal,
  onSetAlertDetails,
  onSupplierDispatch,
  onResetSelectedSupplierPhone,
}: SupplierPhoneFormProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SupplierPhoneInput>({
    resolver: yupResolver(supplierPhoneSchema),
    mode: "onBlur",
  });

  useEffect((): void => {
    if (selectedSupplierPhone) {
      setValue("phone", selectedSupplierPhone.phone);
    }
  }, [selectedSupplierPhone, setValue]);

  const onSubmit: SubmitHandler<SupplierPhoneInput> = async (
    data,
  ): Promise<void> => {
    if (
      !selectedSupplier ||
      (activeTab === "edit-phone" && !selectedSupplierPhone)
    ) {
      return Promise.resolve();
    }

    setIsLoading(true);

    let result: ResponseWithDataAndMessage<PhoneWithID> | undefined;

    try {
      if (activeTab === "add-phone") {
        result = await addSupplierPhone(data, selectedSupplier.id);
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        reset();
        onSupplierDispatch({
          type: "add-phone",
          payload: {
            data: result.data,
            supplierId: selectedSupplier.id,
          },
        });
      } else if (activeTab === "edit-phone") {
        result = await editSupplierPhone(
          data,
          selectedSupplierPhone!.id,
          selectedSupplier.id,
        );
        onSetAlertDetails({
          message: result.message,
          variant: "success",
        });
        reset();
        onSupplierDispatch({
          type: "edit-phone",
          payload: {
            data: result.data,
            supplierId: selectedSupplier.id,
            phoneId: selectedSupplierPhone!.id,
          },
        });
        onResetSelectedSupplierPhone();
        onHideModal();
      }
    } catch (error) {
      console.error("Failed to add supplier phone", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      onShowAlert();
    }
  };

  const handleDelete = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);

    if (!selectedSupplier || !selectedSupplierPhone) {
      return Promise.resolve();
    }

    try {
      const result = await removeSupplierPhone(
        selectedSupplierPhone.id,
        selectedSupplier.id,
      );
      onSetAlertDetails({
        message: result.message,
        variant: "success",
      });
      onSupplierDispatch({
        type: "delete-phone",
        payload: {
          supplierId: selectedSupplier.id,
          phoneId: selectedSupplierPhone.id,
        },
      });
      onResetSelectedSupplierPhone();
      onHideModal();
    } catch (error) {
      console.error("Failed to add supplier phone", error);
      onSetAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      onShowAlert();
    }
  };

  const isActiveTabDelete = activeTab === "delete-phone";

  return (
    <Form onSubmit={isActiveTabDelete ? handleDelete : handleSubmit(onSubmit)}>
      {isActiveTabDelete ? (
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <strong className="font-semibold">
            {selectedSupplierPhone?.phone}
          </strong>{" "}
          for{" "}
          <strong className="font-semibold">{selectedSupplier?.name}</strong>?
        </p>
      ) : (
        <Form.Group className="mb-4">
          <Form.Label htmlFor="phone">Phone</Form.Label>
          <Form.Control
            type="number"
            id="phone"
            {...register("phone")}
            hasError={Boolean(errors.phone)}
          />
          {Boolean(errors.phone) && (
            <Form.Error>{errors.phone?.message}</Form.Error>
          )}
        </Form.Group>
      )}
      <Form.Group>
        <Button
          el="button"
          type="submit"
          variant={isActiveTabDelete ? "danger" : "primary"}
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <span className="flex items-center gap-2">
              <IoIosSave />
              <span>
                {isActiveTabDelete
                  ? "Yes, delete already"
                  : "Save Supplier Phone"}
              </span>
            </span>
          )}
        </Button>
      </Form.Group>
    </Form>
  );
}

export function SupplierImport({
  perPage,
  onSupplierDispatch,
}: SupplierImportProps): React.JSX.Element {
  const [progress, setProgress] = useState<"download" | "upload">("download");

  const left = window.innerWidth <= 425 ? "-350px" : "-460px";

  return (
    <div className="w-full">
      <div className="flex gap-2 w-full mb-4">
        <div className="basis-10">
          <CgDanger className="text-2xl text-red-400" />
        </div>
        <p>
          First download a sample of the csv file. After typing your suppliers
          record in the downloaded csv, click on the "Upload CSV" tab to upload
          your filled csv file.
        </p>
      </div>
      <div className="flex items-center gap-3 border-b-gray-300 border-b-4 pb-2 relative mb-4 md:mb-7">
        <button
          type="button"
          className={`py-1.5 px-3 inline-block hover:bg-gray-200 rounded-sm ${
            progress === "download" ? "text-green-600" : ""
          }`}
          onClick={() => setProgress("download")}
        >
          Download CSV
        </button>
        <button
          type="button"
          className={`py-1.5 px-3 inline-block hover:bg-gray-200 rounded-sm ${
            progress === "upload" ? "text-green-600" : ""
          }`}
          onClick={() => setProgress("upload")}
        >
          Upload CSV
        </button>
        <motion.div
          animate={{
            translateX: progress === "upload" ? "145px" : "0",
            width: progress === "download" ? "133px" : "110px",
          }}
          className="absolute -bottom-1 left-0 h-1 bg-green-600"
        />
      </div>
      <div className="overflow-hidden w-90 md:w-115">
        <motion.div
          animate={{ left: progress === "upload" ? left : "0" }}
          className="relative w-180 md:w-230 flex"
        >
          <div className="w-90 md:w-115">
            <DownloadCSV />
          </div>
          <div className="w-90 md:w-115">
            <UploadCSV
              onSupplierDispatch={onSupplierDispatch}
              perPage={perPage}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DownloadCSV(): React.JSX.Element {
  return (
    <>
      <Headline tag="h5">Instructions</Headline>
      <ol className="list-decimal mx-4 mb-4">
        <li>Download the CSV template</li>
        <li>
          Your entered data should follow the fields just as in the sample
          file(Name, Email, Company Name & Phone)
        </li>
        <li>
          At least the supplier name is required so please don't skip that.
        </li>
        <li>
          For multiple phone numbers, you can comma separate them as follows.
          Eg. 0554835290,0266203090
        </li>
      </ol>
      <a
        href="/csv/supplier.csv"
        download
        className="flex! items-center gap-2 w-fit bg-green-700 hover:bg-green-800 text-white py-1.5 px-3 rounded-sm"
      >
        <LuDownload />
        <span>Download template</span>
      </a>
    </>
  );
}

function UploadCSV({
  perPage,
  onSupplierDispatch,
}: SupplierImportProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<
    { message: string } & Pick<AlertProps, "variant">
  >();

  const uploadFileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsLoading(true);

    const fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
      const formData = new FormData();
      formData.append("file", file);

      await sendFile(formData);
    });
    fileReader.readAsDataURL(file);
  };

  const sendFile = async (formData: FormData): Promise<void> => {
    try {
      const result = await importSuppliers(formData);
      setResponse({
        message: result.message,
        variant: "success",
      });
      onSupplierDispatch({
        type: "import",
        payload: {
          data: result.data.reverse(),
          perPage: perPage,
        },
      });
    } catch (error) {
      console.error("Failed to import suppliers", error);
      setResponse({
        message: (error as Error).message,
        variant: "success",
      });
    } finally {
      setIsLoading(false);
      formRef.current?.reset();
    }
  };

  return (
    <>
      <Headline tag="h5">Instructions</Headline>
      <ol className="list-decimal mx-4 mb-2">
        <li>
          Use the button below to upload your filled csv file. Please this
          process could take some time
        </li>
        <li>
          Incase of failure, upload a new file containing only the mentioned
          rows.
        </li>
      </ol>
      <Form ref={formRef}>
        <input
          type="file"
          hidden
          ref={uploadFileRef}
          onChange={handleOnChange}
        />
      </Form>
      <div className="flex items-center gap-2 mb-2">
        <Button
          el="button"
          variant="primary"
          className="flex! items-center gap-2 w-fit"
          onClick={() => uploadFileRef.current?.click()}
        >
          <RxUpload />
          <span>Select file</span>
        </Button>
        {isLoading ? <Spinner size="sm" color="black" /> : null}
      </div>
      {response && (
        <div
          className={`rounded-md border border-gray-200 py-2 px-3 ${response?.variant === "error" ? "bg-red-100" : "bg-green-100"}`}
        >
          <div className="flex items-center justify-between mb-1">
            <Headline tag="h5">Response</Headline>
            <button
              className="hover:text-red-500"
              onClick={() => setResponse(undefined)}
            >
              <LiaTimesSolid className="text-xl" />
            </button>
          </div>
          <p>{response?.message}</p>
        </div>
      )}
    </>
  );
}
