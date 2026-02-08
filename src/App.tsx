import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";

import { store } from "@/store";
import { Root } from "@/components/layouts/root/Root";
import { Dashboard } from "@/components/layouts/dashboard/Dashboard";
import { NotFound } from "@/pages/not-found/NotFound";
import { Login } from "@/pages/auth/login/Login";
import { ResetPassword } from "@/pages/auth/reset-password/ResetPassword";
import { Overview } from "@/pages/dashboard/overview/Overview";
import { AccountSettings } from "@/pages/dashboard/account-settings/AccountSettings";
import { ForgotPassword } from "@/pages/auth/forgot-password/ForgotPassword";
import { Supplier } from "@/pages/dashboard/supplier/Supplier";
import { Customer } from "@/pages/dashboard/customer/Customer";
import { Employee } from "@/pages/dashboard/employee/Employee";
import { Report } from "@/pages/dashboard/report/Report";
import { CategoriesProducts } from "./pages/dashboard/inventory/categories-products/CategoriesProducts";
import { AvailableStocks } from "./pages/dashboard/inventory/available-stock/AvailableStocks";
import { CanActivate } from "./components/guards/can-activate/CanActivate";
import { CanDeactivate } from "./components/guards/can-deactivate/CanDeactivate";
import { ResetPasswordActivate } from "./components/guards/reset-password-activate/ResetPasswordActivate";
import { Purchase } from "./pages/dashboard/purchase/Purchase";
import { CreateOrder } from "./pages/dashboard/sales/create-order/CreateOrder";
import { OrderHistory } from "./pages/dashboard/sales/order-history/OrderHistory";
import { Arrears } from "./pages/dashboard/sales/arrears/Arrears";
import { EnsureUserHasRole } from "./components/guards/ensure-user-has-role/EnsureUserHasRole";

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
              path: "/dashboard/purchase",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "PROCUREMENT_OFFICER"]}>
                  <Purchase />
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
              path: "/dashboard/sales/order",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "SALES_PERSON"]}>
                  <CreateOrder />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/sales/order-history",
              element: (
                <EnsureUserHasRole roles={["ADMIN", "SALES_PERSON"]}>
                  <OrderHistory />
                </EnsureUserHasRole>
              ),
            },
            {
              path: "/dashboard/sales/arrears",
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
