import { Spin } from 'antd';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Setting = lazy(() => import('@/pages/sys/setting'));

const sys: AppRouteObject = {
  order: 0,
  path: 'sys',
  element: (
    <Suspense fallback={<Spin size="large" />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: '系统设置',
    key: '/sys',
  },
  children: [
    {
      index: true,
      element: <Navigate to="/sys/setting" replace />,
    },
    {
      path: 'setting',
      element: <Setting />,
      meta: { label: '设置', key: '/sys/setting' },
    },
  ],
};

export default sys;
