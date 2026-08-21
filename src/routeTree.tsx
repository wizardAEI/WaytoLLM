import { createRootRoute, createRoute, createRouter } from "@tanstack/solid-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ChapterPage } from "./pages/chapters/ChapterPage";
import { CHAPTERS } from "./config/chapters";

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// 每个章节独立成路由,离开/进入路由时统一走模糊切换动画(见 defaultViewTransition)
const chapterRoutes = CHAPTERS.map((chapter) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: chapter.path,
    component: () => <ChapterPage chapter={chapter} />,
  })
);

export const routeTree = rootRoute.addChildren([indexRoute, ...chapterRoutes]);

export const router = createRouter({
  routeTree,
  defaultViewTransition: true,
});

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}
