import { Spin } from 'antd';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Home = lazy(() => import('@/pages/basic/home'));
const About = lazy(() => import('@/pages/basic/about'));

const basic: AppRouteObject = {
  order: 0,
  path: 'basic',
  element: (
    <Suspense fallback={<Spin size="large" />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: '基础设置',
    key: '/basic',
  },
  children: [
    {
      index: true,
      element: <Navigate to="/basic/home" replace />,
    },
    {
      path: 'home',
      element: <Home />,
      meta: { label: '首页', key: '/basic/home' },
    },
    {
      path: 'about',
      element: <About />,
      meta: { label: '关于', key: '/basic/about' },
    },
  ],
};

export default basic;
