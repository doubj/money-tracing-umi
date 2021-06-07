import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  mock: false,
  proxy: {
    '/api': {
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
