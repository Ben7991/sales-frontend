import { RouterProvider } from "react-router";
import { Provider } from "react-redux";

import { store } from "@/store";
import { appRouter } from "./router";

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}
