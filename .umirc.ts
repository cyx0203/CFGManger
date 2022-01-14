import { defineConfig } from 'umi';

const _MAIN_TITLE = '电子配置单平台';
const _TRADE_URL = 'https://wx.ggzzrj.cn/kwj_dcms/';
const _VERSION = 'V1.3.4';
export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  // proxy: {
  //   '/api': {
  //     'target': 'https://wx.ggzzrj.cn/kwj_dcms/',
  //     'changeOrigin': true,
  //     'pathRewrite': { '^/api': '' },
  //   },
  // },
  define: {
    MAIN_TITLE: _MAIN_TITLE,
    TRADE_URL: _TRADE_URL,
    VERSION: _VERSION,
  },
  title: _MAIN_TITLE,
  nodeModulesTransform: {
    type: 'none',
  },
  request: {
    dataField: 'data',
  },
  // base: './',
  publicPath: './',
  alias: {
    GGGLOBAL: '@/core/global.ts',
    GGService: '@/core/service.ts',
  },
  // layout:{},
  // layout: {
  // // 支持任何不需要 dom 的
  // // https://procomponents.ant.design/components/layout#prolayout
  // name: '配置单管理平台2',
  // // locale: false,
  // // layout: 'side',
  // // logo:'./assets/img/logo.jpg'
  // },
  routes: [
    {
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/',
      component: '@/layouts',
      // access:'canLogin',

      routes: [
        {
          name: '欢迎',
          path: '/welcome',
          icon: 'smile',
          component: '@/pages/welcome',
        },
        // {
        //   name: '配置单',
        //   path: '/cfgform',
        //   icon: 'item',
        //   component: '@/pages/cfgform',

        // },
        {
          name: '配置单',
          path: '/cfgform',
          icon: 'item',
          //  component: '@/pages/cfgform',
          routes: [
            {
              path: '/cfgform/add',
              icon: 'add',
              name: '新增',
              component: '@/pages/cfgform/cfgformAdd',
            },
            {
              path: '/cfgform/edit',
              icon: 'edit',
              name: '修改',
              component: '@/pages/cfgform/cfgformEdit',
            },
            {
              path: '/cfgform/query',
              icon: 'list',
              name: '配置单列表',
              component: '@/pages/cfgform/cfgformQuery',
            },
            //  { path: '/cfgform/add', icon: 'detail', name: '配置单详情', component: '@/pages/welcome' }
          ],
        },
        // {
        //   name: '用户管理',
        //   path: '/index',
        //   icon: 'user',
        //   component: '@/pages/user',
        //   // extra:true,
        //   access: 'justAdmin',
        // },
        // {
        //   name: '部件信息维护',
        //   path: '/maintain',
        //   icon: 'maintain',
        //   component: '@/pages/maintain',
        //   access: 'justAdmin',
        // },
        {
          name: '基础数据维护',
          path: '/cfg',
          icon: 'maintain',
          // component: '@/pages/basedata',
          routes: [
            {
              // path: '@/pages/basedata',
              path: '/cfg/basedata/basedata',
              icon: 'maintain',
              name: '设备型号维护',
              component: '@/pages/cfg/basedata',
            },
            {
              path: '/cfg/maintain/maintain',
              icon: 'maintain',
              name: '部件信息维护',
              component: '@/pages/cfg/maintain',
            },
            //  { path: '/cfgform/add', icon: 'detail', name: '配置单详情', component: '@/pages/welcome' }
          ],
          access: 'justAdmin',
        },
        {
          name: '系统管理',
          path: '/sysManage',
          icon: 'my',
          // component: '@/pages/basedata',
          routes: [
            {
              name: '用户管理',
              path: '/sysManage/index',
              icon: 'user',
              component: '@/pages/sysManage/user',
            },
            {
              name: '我的设置',
              path: '/sysManage/my',
              icon: 'my',
              component: '@/pages/sysManage/my',
            },
            //  { path: '/cfgform/add', icon: 'detail', name: '配置单详情', component: '@/pages/welcome' }
          ],
          access: 'justAdmin',
        },
        // {
        //   name: '我的设置',
        //   path: '/my',
        //   icon: 'my',
        //   component: '@/pages/my',
        // },
      ],
    },
  ],

  fastRefresh: {},
});
