import React, { useCallback, useState, type MouseEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { BsThreeDots } from "react-icons/bs";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

import type {
  DataTableProps,
  PaginatorProps,
  ActionsProps,
  DropdownProps,
  ActionProps,
  DataListProps,
} from "./DataTable.types";
import { useOutsideClick } from "@/utils/hooks.utils";
import { getPaginatedData } from "@/utils/helpers.utils";
import { BiCaretDown } from "react-icons/bi";

export function DataTable({
  children,
  columnHeadings,
  count,
}: DataTableProps): React.JSX.Element {
  return (
    <div className="border border-gray-200 rounded-md bg-white">
      <div className="w-full overflow-y-visible overflow-x-auto">
        <table className="table-collapse table-auto w-full mb-5">
          <thead className="sticky top-0">
            <tr>
              {columnHeadings.map((item) => (
                <th key={item} className="bg-gray-200">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {count >= 10 && <Paginator count={count} />}
    </div>
  );
}

function Paginator({ count }: PaginatorProps): React.JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { page, perPage, query } = getPaginatedData(searchParams);

  const handlePreviousPage = (): void => {
    navigate(
      `${pathname}?page=${page !== 1 ? page - 1 : page}&perPage=${perPage}${query && "&q=" + query}`,
    );
  };

  const handleNextPage = (): void => {
    navigate(
      `${pathname}?page=${page + 1}&perPage=${perPage}${query && "&q=" + query}`,
    );
  };

  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      <p>Rows per page: </p>
      <Dropdown page={page} perPage={perPage} query={query} />
      <p>
        Showing {page === 1 ? page : perPage + 1} -{" "}
        {perPage * page > count ? count : perPage * page} of {count}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed"
          onClick={handlePreviousPage}
          type="button"
          disabled={page === 1}
        >
          <RxCaretLeft className="text-2xl" />
        </button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed"
          onClick={handleNextPage}
          type="button"
          disabled={page * perPage > count}
        >
          <RxCaretRight className="text-2xl" />
        </button>
      </div>
    </div>
  );
}

function Dropdown({ page, perPage, query }: DropdownProps): React.JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);

  const handleOutsideClick = useCallback(() => {
    setShow(false);
  }, []);

  useOutsideClick(handleOutsideClick);

  const handleSelectedItem = (
    value: number,
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();

    const params = new URLSearchParams();
    params.set("perPage", value.toString());

    if (page) params.set("page", page.toString());
    if (query) params.set("q", query);

    navigate(`${pathname}?${params.toString()}`);
    setShow(false);
  };

  const list: Array<number> = [10, 25, 50, 100];

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 py-1 px-2.5 hover:bg-gray-100 border border-gray-300 rounded-md"
        onClick={(e) => {
          e.stopPropagation();
          setShow((prevState) => !prevState);
        }}
      >
        {perPage}
        <BiCaretDown />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 flex flex-col border border-gray-200 bg-white w-full shadow-sm rounded-md"
          >
            {list.map((item) => (
              <button
                className={`inline-block py-1.5 px-4 ${perPage !== item ? "hover:bg-gray-100" : "bg-gray-200"}`}
                onClick={(e) => handleSelectedItem(item, e)}
                key={item}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Actions({ children }: ActionsProps): React.JSX.Element {
  const [show, setShow] = useState(false);

  const handleOutsideClick = useCallback((): void => {
    setShow(false);
  }, []);

  useOutsideClick(handleOutsideClick);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow((prevState) => !prevState);
        }}
        className="cursor-pointer"
      >
        <BsThreeDots className="text-xl" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              setShow(true);
            }}
            className="z-1 absolute top-7 right-0 p-2 w-50 rounded-sm bg-white border border-gray-200 shadow-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Action({
  title,
  className,
  children,
  onClick,
}: ActionProps): React.JSX.Element {
  return (
    <button
      className={`flex gap-2 items-center py-1.5 px-3 w-full rounded-sm cursor-pointer ${className}`}
      type="button"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function DataList({
  list,
  children,
}: DataListProps): React.JSX.Element | string {
  const [show, setShow] = useState(false);

  const handleOutsideClick = useCallback((): void => {
    setShow(false);
  }, []);

  useOutsideClick(handleOutsideClick);

  const buttonText = list.length > 2 ? `+${list.length - 2}` : list.length;

  return list.length ? (
    <div className="flex items-center gap-2 relative w-fit">
      {list.slice(0, 2).map((item) => (
        <span
          key={item.id}
          className="inline-block py-1 px-2 bg-gray-200 rounded-sm text-[0.875em]"
        >
          {item.data}
        </span>
      ))}
      <button
        title="View list"
        className="inline-block py-1 px-2 border border-gray-200 hover:bg-gray-100 rounded-sm cursor-pointer text-[0.875em]"
        onClick={(event) => {
          event.stopPropagation();
          setShow((prevState) => !prevState);
        }}
      >
        {buttonText}
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              setShow(true);
            }}
            className="z-1 absolute top-10 right-0 rounded-sm bg-white py-2 px-3 shadow-sm border border-gray-200 w-62.5 space-y-1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    "-"
  );
}

DataTable.Action = Action;
DataTable.Actions = Actions;
DataTable.DataList = DataList;
