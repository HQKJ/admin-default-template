type PaginationParams = {
  pageNum?: number;
  pageSize?: number;
};

type PaginationData<T> = {
  pageNum: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  list: T[];
};

type PaginationResult<T> = {
  total: number;
  list: T[];
};

type ResponseData<T = any> = {
  code: string;
  data?: T;
  message?: string;
};

interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

type UploadSign = {
  /* 表单的AccessKeyId字段值 */
  accessKeyId: string;
  /* 表单的key字段值，特别说明：上传之后会丢失文件的原始名称，如果对文件原始名称有业务需求的，业务侧自行保存文件名称对应关系，在下载时自行重命名 */
  objectKey: string;
  /* 文件的访问路径，业务侧需要存储这个地址，如果是公共读的可以直接访问，否则需要对这个地址进行加签 */
  originUrl: string;
  /* 表单的policy字段值 */
  policy: string;
  /* 表单的signature字段值 */
  signature: string;
  /* 附件上传地址(post form 提交到这个地址) */
  url: string;
};

type Option = {
  label: string;
  value: string;
};

interface RouteMeta {
  /**
   * antd menu selectedKeys
   */
  key: string;
  /**
   * menu label, i18n
   */
  label: string;
  /**
   * menu prefix icon
   */
  icon?: ReactNode;
  /**
   * menu suffix icon
   */
  suffix?: ReactNode;
  /**
   * hide in menu
   */
  hideMenu?: boolean;
  /**
   * hide in multi tab
   */
  hideTab?: boolean;
  /**
   * disable in menu
   */
  disabled?: boolean;
  /**
   * react router outlet
   */
  outlet?: any;
  /**
   * use to refresh tab
   */
  timeStamp?: string;
  /**
   * external link and iframe need
   */
  frameSrc?: string;
  /**
   * dynamic route params
   *
   * @example /user/:id
   */
  params?: Params<string>;

  pinyin?: string;
}

type AppRouteObject = {
  order?: number;
  meta?: RouteMeta;
  children?: AppRouteObject[];
} & Omit<RouteObject, 'children'>;

interface UserInfo {
  email: string;

  /* 手机号 */
  mobile: string;

  /* 用户昵称 */
  nickName: string;

  /* 权限列表 */
  permissionList: string[];

  /* 角色列表 */
  roleList: Record<string, unknown>[];

  /* 用户唯一标识 */
  userNo: string;

  /* 用户名 */
  username: string;
}

interface SignInReq {
  state: string;
  authCode: string;
}