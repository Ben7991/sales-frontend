import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import type { DateRange } from "react-day-picker";
import { lastDayOfMonth } from "date-fns";
import { GiReceiveMoney } from "react-icons/gi";

import { Card, ReportHeader } from "./Report.partials";
import { getMoneySharing } from "./Report.util";
import { formatAmount, getPaginatedData } from "@/utils/helpers.utils";
import type { MoneySharingResponse } from "./Report.types";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { Alert } from "@/components/molecules/alert/Alert";

export function Report(): React.JSX.Element {
  const [reportData, setReportData] = useState<MoneySharingResponse>();

  const currentDate = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    to: new Date(lastDayOfMonth(currentDate)),
  });

  const [searchParams] = useSearchParams();
  const paginatedResult = getPaginatedData(searchParams);
  const { alertDetails, hideAlert, setAlertDetails } = useAlert();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getMoneySharing(paginatedResult, {
          startDate: date!.from!.toISOString(),
          endDate: date!.to!.toISOString(),
        });
        setReportData(result);
      } catch (error) {
        setAlertDetails({
          message: (error as Error).message,
          variant: "error",
        });
        console.error("Failed to fetch report", error);
      }
    };

    fetchReport();
  }, [date, paginatedResult, setAlertDetails]);

  const totalAmountCollected = useMemo(() => {
    const totalSupplierAmount = reportData?.data?.reduce(
      (prevValue, currentValue) => {
        prevValue += currentValue.amount;
        return prevValue;
      },
      0,
    );

    return (reportData?.bonus ?? 0) + (totalSupplierAmount ?? 0);
  }, [reportData]);

  return (
    <>
      {alertDetails ? (
        <Alert
          variant={alertDetails.variant}
          message={alertDetails.message}
          onHide={hideAlert}
        />
      ) : null}
      <ReportHeader date={date} onSetDate={setDate} />
      <div className="mb-4 flex items-center gap-3">
        <Card
          title="Total amount collected"
          icon={<GiReceiveMoney className="text-3xl" />}
        >
          &#8373; {formatAmount(totalAmountCollected)}
        </Card>
        <Card
          title="Profit made"
          icon={<GiReceiveMoney className="text-2xl" />}
        >
          &#8373; {formatAmount(reportData?.bonus ?? 0)}
        </Card>
      </div>
      <DataTable
        count={reportData?.count ?? 0}
        columnHeadings={[
          "Date Created",
          "Supplier Name",
          "Supplier Company",
          "Amount",
        ]}
      >
        {reportData?.data.map((item) => (
          <tr key={item.id}>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>{item.supplier.name}</td>
            <td>{item.supplier.companyName}</td>
            <td>&#8373; {formatAmount(item.amount)}</td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
