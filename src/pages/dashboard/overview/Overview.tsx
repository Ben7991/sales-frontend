import { useEffect, useState } from "react";

import { useFetch } from "@/utils/hooks.utils";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";
import type { EntitySummary, HighValueCustomer } from "./Overview.types";
import { getEntitySummary, getHighValueCustomers } from "./Overview.utils";
import {
  EntitySummaryUI,
  HighValueCustomerAndOrderPayment,
} from "./Overview.partials";

export function Overview(): React.JSX.Element {
  const { isFetching, setIsFetching } = useFetch();
  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  const [highValueCustomers, setHighValueCustomers] = useState<
    Array<HighValueCustomer>
  >([]);

  const [entitySummary, setEntitySummary] =
    useState<Pick<EntitySummary, "summary">>();

  useEffect((): void => {
    const fetchSummary = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getEntitySummary();
        setEntitySummary(result.data);
      } catch (error) {
        console.error("Failed to fetch summary entity data", error);
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchSummary();
  }, [setIsFetching, setAlertDetails]);

  useEffect((): void => {
    const fetchHighValueCustomers = async (): Promise<void> => {
      setIsFetching(true);
      try {
        const result = await getHighValueCustomers();
        setHighValueCustomers(result.data);
      } catch (error) {
        console.error("Failed to fetch high values customers", error);
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchHighValueCustomers();
  }, [setIsFetching, setAlertDetails]);

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <PageDescriptor title="Dashboard" spinnerState={isFetching} />
      <EntitySummaryUI
        totalCategories={entitySummary?.summary?.totalCategories ?? 0}
        totalCustomers={entitySummary?.summary?.totalCustomers ?? 0}
        totalProducts={entitySummary?.summary?.totalProducts ?? 0}
        totalSuppliers={entitySummary?.summary?.totalSuppliers ?? 0}
      />
      <HighValueCustomerAndOrderPayment
        orders={entitySummary?.summary?.orders}
        highValueCustomers={highValueCustomers}
      />
    </>
  );
}
