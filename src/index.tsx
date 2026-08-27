import { render } from "solid-js/web";
import { RouterProvider } from "@tanstack/solid-router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { router } from "./routeTree";
import { initTheme } from "./theme/theme";
import { initExternalLinks } from "./utils/externalLinks";
import "./styles/global.css";

initTheme();
initExternalLinks();

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  ),
  document.getElementById("root")!
);
