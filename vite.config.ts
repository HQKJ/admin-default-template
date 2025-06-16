import * as path from 'path';
import { defineConfig } from 'vite';
import viteConfig from '@admin/vite-config';

const config: any = ({ mode }) => {
  return viteConfig({
    base: '/',
    mode,
    pwd: __dirname,
    system: 'admin',
    path,
    port: 8989,
    proxy: {},
  });
};

export default defineConfig(config);
