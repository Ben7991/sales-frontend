import { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { format } from "date-fns";

import { Headline } from "@/components/atoms/headline/Headline";
import type { CardProps, ReportHeaderProps } from "./Report.types";
import { Calendar } from "@/components/molecules/calendar/Calendar";
import { PageDescriptor } from "@/components/molecules/page-descriptor/PageDescriptor";

export function Card({ icon, title, children }: CardProps): React.JSX.Element {
  return (
    <div className="w-full rounded-md md:w-75 bg-white flex items-start gap-4 p-4 md:p-6 border border-gray-200">
      <div className="w-fit">{icon}</div>
      <div className="space-y-1">
        <p>{title}</p>
        <Headline tag="h3">{children}</Headline>
      </div>
    </div>
  );
}

export function ReportHeader({
  date,
  onSetDate,
}: ReportHeaderProps): React.JSX.Element {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <PageDescriptor title="Report" className="flex-row! justify-between">
      <div className="relative w-fit">
        <button
          className="flex items-center bg-white border justify-start px-2.5 font-normal rounded-md py-1.5 gap-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowCalendar(!showCalendar);
          }}
        >
          <CiCalendar className="text-xl" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </button>
        {showCalendar && (
          <div className="absolute top-10 right-0 w-auto z-2">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onSetDate}
              numberOfMonths={2}
              className="[--cell-size:1.5rem] rounded-lg border calendar"
            />
          </div>
        )}
      </div>
    </PageDescriptor>
  );
}
