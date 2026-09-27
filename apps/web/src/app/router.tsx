import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthPage } from "../features/auth/auth-page";
import { RequireAuth } from "../features/auth/require-auth";
import { DashboardPage } from "../features/dashboard/dashboard-page";
import { HomePage } from "../features/home/home-page";
import { NotFoundPage } from "../features/not-found/not-found-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  { path: "/sign-in", element: <AuthPage mode="sign-in" /> },
  { path: "/sign-up", element: <AuthPage mode="sign-up" /> },
  {
    path: "/app",
    element: <RequireAuth />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects", element: <DashboardPage section="projects" /> },
      { path: "journal", element: <DashboardPage section="journal" /> },
      { path: "account", element: <DashboardPage section="account" /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
