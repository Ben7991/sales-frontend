import type { Dispatch, SetStateAction } from "react";
import type { DateRange } from "react-day-picker";

import type { MoneySharing } from "@/utils/types.utils";

export type CardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export type MoneySharingResponse = {
  count: number;
  bonus: number;
  data: Array<MoneySharing>;
};

export type Paginate = {
  query: string;
  page: number;
  perPage: number;
};

export type RecordRange = {
  startDate: string;
  endDate: string;
};

export type ReportHeaderProps = {
  date?: DateRange;
  onSetDate: Dispatch<SetStateAction<DateRange | undefined>>;
};
