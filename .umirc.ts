import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
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
  proxy: {
    '/api': {
      // target: 'http://42.192.49.233:3010/api/',
      target: 'http://localhost:3005/api/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
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
