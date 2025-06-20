import apiClient from '@/api/apiClient';
import bg08 from '@/assets/images/bg08.jpg';
import logo from '@/assets/images/logo.png';
import { ResultEnum, StorageEnum } from '@/enum';
import { setItem } from '@/utils/storage';
import { Divider, Spin, Typography, message } from 'antd';
import { createStyles } from 'antd-style';
import { FC, useEffect, useState } from 'react';

const useStyles = createStyles(({ token }) => ({
  loginContainer: {
    display: 'flex',
    height: '100vh',
    background: '#fff',
    overflow: 'hidden',
  },
  leftContainer: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  leftOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2) 90%, rgba(0, 0, 0, 0.5) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: '#fff',
    '& p': {
      fontSize: '18px',
      marginBottom: '40px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
  },
  rightContainer: {
    width: '840px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.05)',
  },
  loginForm: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  logo: {
    marginBottom: '20px',
    '& img': {
      height: '64px',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
  },
  title: {
    marginBottom: '40px',
    textAlign: 'center',
    color: token.colorPrimary,
  },
  tips: {
    marginTop: '24px',
    color: '#666',
    fontSize: '14px',
  },
  footer: {
    padding: '24px',
    textAlign: 'center',
    color: '#999',
    fontSize: '12px',
    borderTop: '1px solid #f0f0f0',
    '& p': {
      margin: '8px 0',
    },
    '& a': {
      color: '#666',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: token.colorPrimary,
      },
    },
  },
  iframeContainer: {
    position: 'relative',
    width: '480px',
    height: '600px',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  '@media screen and (max-width: 1200px)': {
    rightContainer: {
      width: '600px',
    },
    iframeContainer: {
      width: '400px',
      height: '500px',
    },
  },
  '@media screen and (max-width: 768px)': {
    loginContainer: {
      flexDirection: 'column',
    },
    leftContainer: {
      height: '30vh',
    },
    rightContainer: {
      width: '100%',
      height: '70vh',
    },
    iframeContainer: {
      width: '90%',
      height: '400px',
    },
  },
}));

const dingSignIn = (data: SignInReq) =>
  apiClient.post({
    url: '/auth/login/dingtalk',
    data,
    baseURL: '/iam-app-biz/api',
    returnResponse: true,
  });

// 钉钉登录配置
const DINGTALK_CONFIG = {
  redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'openid',
  prompt: 'consent',
  clientId: import.meta.env.VITE_CLIENT_ID,
  state: import.meta.env.VITE_STATE,
};

// 构建钉钉登录URL
const buildDingtalkLoginUrl = () => {
  const params = new URLSearchParams(DINGTALK_CONFIG);

  return `https://login.dingtalk.com/oauth2/challenge.htm?${params.toString()}`;
};

/**
 * 供应商专用的登录页
 * */
const Login: FC = () => {
  const { styles } = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const dingtalkLoginUrl = buildDingtalkLoginUrl();
  const [iframeError, setIframeError] = useState(false);

  // 处理iframe加载错误
  const handleIframeError = () => {
    setIframeError(true);
    message.error('钉钉登录加载失败，请刷新页面重试');
    // 通知父页面显示错误提示
    window.parent.postMessage(
      {
        type: 'iframeError',
        message: '钉钉登录加载失败，请刷新页面重试',
      },
      '*',
    );
  };

  const autoLogin = async (params) => {
    try {
      setIsLoading(true);
      const { code, data = {}, message: apiMessage } = await dingSignIn({ ...params });

      if (code === ResultEnum.SUCCESS) {
        const { jwt, accessToken, userNo } = data as any;
        if (jwt || accessToken) {
          setItem(StorageEnum.Token, accessToken ?? jwt);
          setItem(StorageEnum.UserNo, userNo ?? '');

          window.parent.location.href = '/purchase/order?orderStatus=5';
        }
      } else {
        window.location.href = dingtalkLoginUrl; // 重定向到钉钉登录页面
        // 通知父页面显示错误提示
        window.parent.postMessage(
          {
            type: 'loginError',
            message: apiMessage,
          },
          '*',
        );
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const authCode = currentParams.get('authCode') || '';

    if (authCode) {
      autoLogin({ appNo: DINGTALK_CONFIG.state, authCode });
    } else {
      setIsLoading(false);
    }
  }, []);

  // 监听错误提示
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'iframeError' || event.data.type === 'loginError') {
        message.error(event.data.message);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
          <Spin spinning={isLoading} size="large" />
        </div>
      ) : (
        <div className={styles.loginContainer}>
          {/* 左侧背景区域 */}
          <div className={styles.leftContainer}>
            <img src={bg08} alt="背景图" />
            <div className={styles.leftOverlay}>
              <p>
                创新成就美好生活{' '}
                <Divider
                  type="vertical"
                  style={{
                    borderInlineStart: '1px solid rgba(255, 255, 255, 0.5)',
                    fontSize: '16px',
                  }}
                />{' '}
                创造世界一流品牌
              </p>
            </div>
          </div>

          {/* 右侧登录区域 */}
          <div className={styles.rightContainer}>
            <div className={styles.loginForm}>
              {/* Logo */}
              <div className={styles.logo}>
                <img src={logo} alt="Logo" />
              </div>

              {/* 标题 */}
              <Typography.Title level={2} className={styles.title}>
                {import.meta.env.VITE_SYSTEM_NAME}
              </Typography.Title>

              {/* 登录iframe容器 */}
              <div className={styles.iframeContainer}>
                {iframeError ? (
                  <div className={styles.loadingOverlay}>
                    <Typography.Text type="danger">
                      钉钉登录加载失败，请刷新页面重试
                    </Typography.Text>
                  </div>
                ) : (
                  <iframe
                    src={dingtalkLoginUrl}
                    className={styles.iframe}
                    // onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title="钉钉登录"
                  />
                )}
              </div>

              {/* 提示文本 */}
              {/* <p className={styles.tips}>请使用钉钉扫码登录系统</p> */}
            </div>

            {/* 页脚版权信息 */}
            <div className={styles.footer}>
              <p>Copyright © {new Date().getFullYear()} 华青科技. All Rights Reserved.</p>
              <p>
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                  ICP备案号
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
