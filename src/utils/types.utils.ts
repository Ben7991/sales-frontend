export type ResponseWithDataAndMessage<T> = {
  message: string;
  data: T;
};

export type ResponseWithOnlyData<T> = {
  data: T;
};

export type ResponseWithRecord<T> = {
  count: number;
  data: Array<T>;
};

export type DataWithID = { id: number; data: string };

export type Role = "ADMIN" | "SALES_PERSON" | "PROCUREMENT_MANAGER";
export type AccountStatus = "ACTIVE" | "SUSPENDED";
export type AvailabilityStatus = "ACTIVE" | "IN_ACTIVE";
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
export type Supplier = {
  id: number;
  createdAt: string;
  name: string;
  companyName: string;
  email: string;
  status: AvailabilityStatus;
  supplierPhones: Array<{ id: number; phone: string }>;
};

export const StatusCodes = {
  CREATED: 201,
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UN_AUTHORIZED: 401,
  FORBIDDEN: 403,
  VALIDATION_FAILED: 422,
  SERVER_ERROR: 500,
} as const;

export type AuthState = "loading" | "authenticated" | "not-authenticated";
