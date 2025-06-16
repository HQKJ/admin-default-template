import { useEffect } from 'react';
import { useDingSingIn, useUserActions, useUserInfo } from '@/store/userStore';
import { MenuLayout, jumpToDingDingLogin } from '@admin/ui';
import { usePermissionRoutes, useRouter } from '@/router/hooks';

const ENV_NAME = import.meta.env.VITE_ENV_NAME;
const APP_VER = import.meta.env.VITE_APP_VER;

function DashboardLayout() {
  const { replace } = useRouter();

  const { username, email } = useUserInfo();
  const signIn = useDingSingIn(); // 请求用户的数据
  const { clearUserInfoAndToken } = useUserActions();
  const permissionRoutes = usePermissionRoutes();

  const logout = () => {
    try {
      clearUserInfoAndToken();
      jumpToDingDingLogin(import.meta.env.VITE_CLIENT_ID, import.meta.env.VITE_STATE);
    } catch (error) {
      console.log(error);
    } finally {
      replace('/login');
    }
  };

  useEffect(() => {
    signIn();
  }, []);

  return (
    <MenuLayout
      permissionRoutes={permissionRoutes as AppRouteObject[]}
      permissionList={['/basic/home', '/basic/about', '/sys/setting']} // TODO
      username={username}
      email={email}
      onLogout={logout}
      version={APP_VER}
      envName={ENV_NAME}
    />
  );
}
export default DashboardLayout;
