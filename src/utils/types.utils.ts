export type ResponseWithDataAndMessage<T> = {
  message: string;
  data: T;
};

export type Role = "ADMIN" | "SALES_PERSON" | "PROCUREMENT_MANAGER";
export type AccountStatus = "ACTIVE" | "SUSPENDED";
export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  status: AccountStatus;
  setPassword: boolean;
};
