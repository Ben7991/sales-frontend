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
import { ForgotPassword } from "./pages/auth/forgot-password/ForgotPassword";

export default function App(): React.JSX.Element {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/", index: true, element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <ResetPassword /> },
        {
          path: "/dashboard",
          element: <Dashboard />,
          children: [
            { index: true, element: <Overview /> },
            {
              path: "/dashboard/account-settings",
              element: <AccountSettings />,
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
