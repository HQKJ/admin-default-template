import { lazy } from 'react';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '@/layouts/dashboard';
import { usePermissionRoutes } from '@/router/hooks';
import ErrorPage from './components/error-page';

const LoginRoute: AppRouteObject = {
  path: '/login',
  Component: lazy(() => import('@/pages/sys/login')),
};

export default function Router() {
  const permissionRoutes = usePermissionRoutes();
  const children = [...permissionRoutes];

  const asyncRoutes: AppRouteObject = {
    path: '/',
    element: <DashboardLayout />,
    children,
    errorElement: <ErrorPage />,
  };
  const routes = [LoginRoute, asyncRoutes];
  const router = createBrowserRouter(routes as unknown as RouteObject[]);
  return <RouterProvider router={router} />;
}
