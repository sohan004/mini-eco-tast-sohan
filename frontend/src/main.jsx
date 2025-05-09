import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import routes from "./routes";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>,
);
