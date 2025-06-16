import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isEmpty } from 'ramda';
import { getSubDomainToken as getToken } from '@admin/common';
import { jumpToDingDingLogin, DebounceMessage } from '@admin/ui';
import { ResultEnum } from '@/enum';

interface AxiosRequestConfigProps extends AxiosRequestConfig {
  /** 是否返回接口原始数据接口， 适用于接口允许返回部分成功部分失败的情况，或者需要自行显示message字段的场景 */
  returnResponse?: boolean;
}

const getAxiosInstance = (options: AxiosRequestConfigProps) => {
  // 创建 axios 实例
  const axiosInstance = axios.create({
    timeout: options?.timeout ?? 50000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });

  // 请求拦截
  axiosInstance.interceptors.request.use(
    (config) => {
      // 在请求被发送之前做些什么
      const token = getToken();
      if (token) {
        config.headers.Authorization = token ? `Bearer ${token}` : '';
      }
      // 避免覆盖定 baseURL, baseURL 已经被另作他用
      // delete config.baseURL;
      return config;
    },
    (error) => {
      // 请求错误时做些什么
      return Promise.reject(error);
    },
  );

  // 响应拦截
  axiosInstance.interceptors.response.use(
    (res: AxiosResponse<ResponseData>) => {
      // 接口正常请求回来
      if (!res.data) throw new Error('请求出错，请稍候重试');
      const { code, data, message } = res.data;

      if (options.returnResponse) {
        return res.data;
      }

      // 业务请求成功
      if (code === ResultEnum.SUCCESS || code === ResultEnum.IMPORTFAIL) {
        return data;
      }

      // 手动更新错误的时候提示
      if (code === ResultEnum.UPGRADING) {
        DebounceMessage.error(message);
      }

      if (res.status === 200) {
        return res.data;
      }

      // 业务请求错误
      throw new Error(message || '请求出错，请稍候重试');
    },
    (error: AxiosError<ResponseData>) => {
      // 接口错误直接到这
      const { response, message, request } = error || {};
      // 未授权
      if (response?.status === 401) {
        jumpToDingDingLogin(import.meta.env.VITE_CLIENT_ID, import.meta.env.VITE_STATE, '', true);
        return false;
      }

      if (request.responseType === 'arraybuffer' || request.responseType === 'blob') {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(response?.data as any);
        try {
          const json = JSON.parse(text);
          DebounceMessage.error(json?.message || 'unknown error');
          return Promise.reject(json);
        } catch (error) {
          return Promise.reject(text);
        }
      }

      let errMsg = '';
      try {
        errMsg = response?.data?.message || message;
        if (options.returnResponse) {
          return response?.data;
        }
      } catch (error) {
        throw new Error(error as unknown as string);
      }

      // 对响应错误做点什么
      if (isEmpty(errMsg)) {
        errMsg = '操作失败,系统异常!';
      }
      DebounceMessage.error(errMsg);

      return Promise.reject(error);
    },
  );
  return axiosInstance;
};

class APIClient {
  get<T = any>(config: AxiosRequestConfigProps): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfigProps): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfigProps): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfigProps): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfigProps): Promise<T> {
    const axiosInstance = getAxiosInstance(config);

    // 重写 baseURL
    const baseURL = config.baseURL || import.meta.env.VITE_APP_API_PATH;
    config.baseURL = import.meta.env.VITE_APP_BASE_API + baseURL;

    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<ResponseData>>(config)
        .then((res: AxiosResponse<ResponseData>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
export default new APIClient();
