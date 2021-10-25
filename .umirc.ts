import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'browser',
  },
  base: '/money-tracing-umi/',
  publicPath: '/money-tracing-umi/',
  mock: false,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.0/umd/react-dom.production.min.js',
  ],
  routes: [
    { path: '/login', component: 'login' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/dashboard',
          component: 'dashboard',
        },
        {
          path: '/transactions',
          component: 'transactions',
        },
        {
          path: '/templates',
          component: 'templates',
        },
      ],
    },
  ],
  fastRefresh: {},
});
