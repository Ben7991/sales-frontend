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
import { CreatePurchase } from "./pages/dashboard/purchase/create-purchase/CreatePurchase";
import { AllPurchase } from "./pages/dashboard/purchase/all-purchase/AllPurchase";
import { CategoriesProducts } from "./pages/dashboard/inventory/categories-products/CategoriesProducts";
import { AvailableStocks } from "./pages/dashboard/inventory/available-stock/AvailableStocks";
import { Arrears } from "./pages/dashboard/sales/arrears/Arrears";
import { AllSales } from "./pages/dashboard/sales/all-sales/AllSales";
import { CreateOrder } from "./pages/dashboard/sales/create-order/CreateOrder";
import { CanActivate } from "./components/guards/can-activate/CanActivate";
import { CanDeactivate } from "./components/guards/can-deactivate/CanDeactivate";
import { ResetPasswordActivate } from "./components/guards/reset-password-activate/ResetPasswordActivate";

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
            { path: "/dashboard/suppliers", element: <Supplier /> },
            { path: "/dashboard/customers", element: <Customer /> },
            {
              path: "/dashboard/inventory/categories-products",
              element: <CategoriesProducts />,
            },
            {
              path: "/dashboard/inventory/available-stocks",
              element: <AvailableStocks />,
            },
            { path: "/dashboard/purchase/create", element: <CreatePurchase /> },
            { path: "/dashboard/purchase/stocks", element: <AllPurchase /> },
            { path: "/dashboard/sales/new", element: <CreateOrder /> },
            { path: "/dashboard/sales/sold", element: <AllSales /> },
            { path: "/dashboard/sales/arrears", element: <Arrears /> },
            { path: "/dashboard/employees", element: <Employee /> },
            { path: "/dashboard/report", element: <Report /> },
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
