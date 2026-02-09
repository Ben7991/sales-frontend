export type EntitySummary = {
  summary: {
    totalCategories: number;
    totalCustomers: number;
    totalSuppliers: number;
    totalProducts: number;
    orders: {
      paid: number;
      outstanding: number;
    };
  };
};

export type HighValueCustomer = {
  name: string;
  percent: number;
};

export type EntityCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  path: string;
};

export type HighValueCustomerAndOrderPaymentProps = {
  orders?: {
    paid: number;
    outstanding: number;
  };
  highValueCustomers: Array<HighValueCustomer>;
};

export type EntitySummaryUIProps = Pick<
  EntitySummary["summary"],
  "totalCategories" | "totalCustomers" | "totalProducts" | "totalSuppliers"
>;
