export type DataTableProps = {
  columnHeadings: Array<string>;
  children?: React.ReactNode;
  count: number;
};

export type PaginatorProps = {
  count: number;
};

export type ActionsProps = {
  children?: React.ReactNode;
};

export type ActionProps = ActionsProps & {
  className?: string;
  onClick?: VoidFunction;
  title?: string;
};

export type DropdownProps = {
  perPage: number;
  page: number;
  query: string;
};

export type DataListProps = {
  list: Array<{
    id: number;
    data: string;
  }>;
  children?: React.ReactNode;
};
