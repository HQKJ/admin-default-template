import { App } from 'antd';
import { useCallback } from 'react';
import { create } from 'zustand';

import { getItem, removeItem, setItem } from '@/utils/storage';
import { StorageEnum } from '@/enum';

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: string;
  // 使用 actions 命名空间来存放所有的 action
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: string) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>((set) => ({
  userInfo: getItem<UserInfo>(StorageEnum.User) || {},
  userToken: getItem<string>(StorageEnum.Token) || '',
  actions: {
    setUserInfo: (userInfo) => {
      set({ userInfo });
      setItem(StorageEnum.User, userInfo);
    },
    setUserToken: (userToken) => {
      set({ userToken });
      setItem(StorageEnum.Token, userToken);
    },
    clearUserInfoAndToken() {
      set({ userInfo: {}, userToken: '' });
      removeItem(StorageEnum.User);
      removeItem(StorageEnum.Token);
    },
  },
}));

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userInfo.permissionList);
export const useUserActions = () => useUserStore((state) => state.actions);

// 通过钉钉调转进行登录
export const useDingSingIn = () => {
  const { message } = App.useApp();

  const { setUserInfo } = useUserActions();

  const signIn = async () => {
    try {
      // const userInfo = await userInfoMutation.mutateAsync();
      // setUserInfo(userInfo);
    } catch (err) {
      message.warning({
        content: err.message,
        duration: 3,
      });
    }
  };

  return useCallback(signIn, []);
};
