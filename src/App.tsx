import { App as AntdApp } from 'antd';
import { Helmet } from 'react-helmet-async';

import Logo from '@/assets/images/logo.png';
import Router from '@/router/index';
import AntdConfig from '@/theme/antd';

const App = () => {
  return (
    <AntdConfig>
      <AntdApp>
        <>
          <Helmet>
            <title>{import.meta.env.VITE_SYSTEM_NAME}</title>
            <link rel="icon" href={Logo} />
          </Helmet>

          <Router />
        </>
      </AntdApp>
    </AntdConfig>
  );
};

export default App;
