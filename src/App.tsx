import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";

import { Root } from "@/components/layouts/root/Root";
import { Login } from "@/pages/auth/login/Login";
import { ResetPassword } from "@/pages/auth/reset-password/ResetPassword";
import { Dashboard } from "@/components/layouts/dashboard/Dashboard";
import { Overview } from "@/pages/dashboard/overview/Overview";
import { AccountSettings } from "@/pages/dashboard/account-settings/AccountSettings";
import { store } from "@/store";

export default function App(): React.JSX.Element {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/", index: true, element: <Login /> },
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
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}
