import apiClient from '../apiClient';

export interface SignUpReq extends SignInReq {
  email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
  DingSignIn = '/user/authFromDingDingV3',
  UserInfo = '/iam-app-biz/api/user/info',
}

const APP_ACCOUNT_API_PATH = import.meta.env.VITE_APP_ACCOUNT_API_PATH;
const dingSignIn = (params: SignInReq) =>
  apiClient.get({ url: UserApi.DingSignIn, params, baseURL: APP_ACCOUNT_API_PATH });
const fetchUserInfo = () => apiClient.get<UserInfo>({ url: UserApi.UserInfo, baseURL: '/' });

export default {
  dingSignIn,
  fetchUserInfo,
};
