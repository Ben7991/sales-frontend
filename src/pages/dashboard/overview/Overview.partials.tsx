import { Link } from "react-router";
import { PiStack } from "react-icons/pi";
import { TbBowlChopsticks } from "react-icons/tb";
import { HiArrowLongRight } from "react-icons/hi2";
import { LiaUsersCogSolid, LiaUsersSolid } from "react-icons/lia";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

import { Headline } from "@/components/atoms/headline/Headline";
import type {
  EntityCardProps,
  EntitySummaryUIProps,
  HighValueCustomerAndOrderPaymentProps,
} from "./Overview.types";
import { useAppSelector } from "@/store/index.util";

export function EntitySummaryUI({
  totalCategories,
  totalCustomers,
  totalProducts,
  totalSuppliers,
}: EntitySummaryUIProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2 2xl:gap-3 mb-4 xl:mb-6">
      <EntityCard
        title="Total Customers"
        count={totalCustomers}
        icon={<LiaUsersSolid className="text-4xl" />}
        path="/dashboard/customers"
      />
      <EntityCard
        title="Total Suppliers"
        count={totalSuppliers}
        icon={<LiaUsersCogSolid className="text-4xl" />}
        path="/dashboard/suppliers"
      />
      <EntityCard
        title="Total Products"
        count={totalProducts}
        icon={<TbBowlChopsticks className="text-4xl" />}
        path="/dashboard/inventory/categories-products"
      />
      <EntityCard
        title="Total Categories"
        count={totalCategories}
        icon={<PiStack className="text-4xl" />}
        path="/dashboard/inventory/categories-products"
      />
    </div>
  );
}

function EntityCard({
  title,
  icon,
  count,
  path,
}: EntityCardProps): React.JSX.Element {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="border border-gray-200 rounded-md bg-white basis-full md:basis-1/3 2xl:basis-[24.22%]">
      <div className="flex justify-between p-4">
        <div className="space-y-1">
          <p>{title}</p>
          <Headline tag="h3">{count}</Headline>
        </div>
        <div className="w-fit">{icon}</div>
      </div>
      {user?.role === "ADMIN" && (
        <>
          <hr className="border-b border-b-gray-200" />
          <div className="py-1.5 px-4 flex justify-end">
            <Link
              to={path}
              className="flex items-center gap-2 w-fit py-1 px-2 hover:bg-gray-100 rounded-sm"
            >
              <small>View Details</small>
              <HiArrowLongRight />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export function HighValueCustomerAndOrderPayment({
  orders,
  highValueCustomers,
}: HighValueCustomerAndOrderPaymentProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 md:flex-row items-center justify-between">
      <div className="bg-white basis-full md:basis-[49.5%] p-4 rounded-md border border-gray-200 ">
        <div className="flex items-center justify-between mb-4">
          <Headline tag="h5">High Value Customers</Headline>
        </div>
        <Doughnut
          data={{
            labels: highValueCustomers.map((item) => item.name),
            datasets: [
              {
                label: "High Value Customers",
                data: highValueCustomers.map((item) => item.percent),
                backgroundColor: [
                  "#162556",
                  "#1C398E",
                  "#193CB8",
                  "#1447E6",
                  "#155DFC",
                  "#2B7FFF",
                  "#50A2FF",
                  "#024A70",
                  "#00598A",
                  "#0069A8",
                ],
                hoverOffset: 4,
              },
            ],
          }}
        />
      </div>
      <div className="bg-white basis-full md:basis-[49.5%] p-4 rounded-md border border-gray-200">
        <Headline tag="h5" className="mb-4">
          Order Payment Status
        </Headline>
        <Pie
          data={{
            labels: ["Paid", "Outstanding"],
            datasets: [
              {
                label: "Order Payments",
                data: [orders?.paid ?? 0, orders?.outstanding ?? 0],
                backgroundColor: ["#5EA500", "#497D00"],
                hoverOffset: 4,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
