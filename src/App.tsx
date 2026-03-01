import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { lazy } from "react";

import { store } from "@/store";
import { Root } from "@/components/layouts/root/Root";
import { Dashboard } from "@/components/layouts/dashboard/Dashboard";
import { NotFound } from "@/pages/not-found/NotFound";
import { CanActivate } from "./components/guards/can-activate/CanActivate";
import { CanDeactivate } from "./components/guards/can-deactivate/CanDeactivate";
import { ResetPasswordActivate } from "./components/guards/reset-password-activate/ResetPasswordActivate";
import { EnsureUserHasRole } from "./components/guards/ensure-user-has-role/EnsureUserHasRole";

const Login = lazy(() => import("./pages/auth/login/Login"));
const ForgotPassword = lazy(
  () => import("./pages/auth/forgot-password/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("./pages/auth/reset-password/ResetPassword"),
);

const Overview = lazy(() => import("./pages/dashboard/overview/Overview"));
const Supplier = lazy(() => import("./pages/dashboard/supplier/Supplier"));
const Customer = lazy(() => import("./pages/dashboard/customer/Customer"));
const Employee = lazy(() => import("./pages/dashboard/employee/Employee"));
const Report = lazy(() => import("./pages/dashboard/report/Report"));
const AddEditSupplies = lazy(
  () => import("./pages/dashboard/purchase/add-edit-supplies/AddEditSupplies"),
);
const PurchaseHistory = lazy(
  () => import("./pages/dashboard/purchase/history/PurchaseHistory"),
);
const PurchaseDetails = lazy(
  () => import("./pages/dashboard/purchase/details/PurchaseDetails"),
);
const CategoriesProducts = lazy(
  () =>
    import("./pages/dashboard/inventory/categories-products/CategoriesProducts"),
);
const CreateOrder = lazy(
  () => import("./pages/dashboard/sales/create-order/CreateOrder"),
);
const AvailableStocks = lazy(
  () => import("./pages/dashboard/inventory/available-stock/AvailableStocks"),
);
const OrderHistory = lazy(
  () => import("./pages/dashboard/sales/order-history/OrderHistory"),
);
const Arrears = lazy(() => import("./pages/dashboard/sales/arrears/Arrears"));
const AccountSettings = lazy(
  () => import("./pages/dashboard/account-settings/AccountSettings"),
);

export default function App(): React.JSX.Element {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/",
          index: true,
          element: (
            <CanDeactivate>
              <Login />
            </CanDeactivate>
          ),
        },
        {
          path: "/forgot-password",
          element: (
            <CanDeactivate>
              <ForgotPassword />
            </CanDeactivate>
          ),
        },
        {
          path: "/reset-password",
          element: (
            <ResetPasswordActivate>
              <ResetPassword />
            </ResetPasswordActivate>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <CanActivate>
              <Dashboard />
            </CanActivate>
          ),
          children: [
            { index: true, element: <Overview /> },
            {
              path: "/dashboard/account-settings",
              element: <AccountSettings />,
            },
            {
              path: "/dashboard/suppliers",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "PROCUREMENT_OFFICER"]}>
                  <Supplier />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/purchases",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "PROCUREMENT_OFFICER"]}>
                  <PurchaseHistory />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/purchases/add-edit",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "PROCUREMENT_OFFICER"]}>
                  <AddEditSupplies />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/purchases/:id",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "PROCUREMENT_OFFICER"]}>
                  <PurchaseDetails />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/customers",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "SALES_PERSON"]}>
                  <Customer />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/inventory/categories-products",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "PROCUREMENT_OFFICER"]}>
                  <CategoriesProducts />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/inventory/available-stocks",
              element: <AvailableStocks />,
            },
            {
              path: "/dashboard/sales/add-edit",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "SALES_PERSON"]}>
                  <CreateOrder />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/sales",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "SALES_PERSON"]}>
                  <OrderHistory />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/arrears",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "SALES_PERSON"]}>
                  <Arrears />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/employees",
              element: (
                <EnsureUserHasRole roles={["ADMIN"]}>
                  <Employee />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/report",
              element: (
                <EnsureUserHasRole roles={["ADMIN"]}>
                  <Report />
                </EnsureUserHasRole>
              ),
            },
          ],
        },
      ],
      errorElement: <NotFound />,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}
