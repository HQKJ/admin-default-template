import 'antd/dist/reset.css';

import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, theme } from 'antd';
import zh_CN from 'antd/locale/zh_CN';
import { ComponentsThemeOtherSystem } from '@admin/common/store/theme';

type Props = {
  children: React.ReactNode;
};
export default function AntdConfig({ children }: Props) {
  return (
    <ConfigProvider
      locale={zh_CN}
      componentSize="middle"
      theme={{
        token: ComponentsThemeOtherSystem.token,
        components: ComponentsThemeOtherSystem.components as any,
        cssVar: ComponentsThemeOtherSystem.cssVar,
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </ConfigProvider>
  );
}
