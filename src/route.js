import axios from 'axios';
//  专门用来展示静态HTML文件的组件
const Html = {
  template: '<div v-html="html"></div>',
  data: () => ({
    html: ''
  }),
  beforeRouteEnter(to, from, next) {
    axios.get('/static/html/' + to.params.file).then(response => {
      next(vm => {
        vm.html = response.data;
        vm.$nextTick(() => vm.$emit('loaded'));
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.$emit('loaded', 1);
    axios.get('/static/html/' + to.params.file).then(response => {
      this.html = response.data;
      this.$nextTick(() => {
        this.$emit('loaded', 0);
        next();
      });
    });
  }
};

export const route = [
  {
    path: '/',
    component: () => import('./components/index.vue'),
    children: [
      {
        path: '/resetpsw', component: () => import('./components/login/resetpsw.vue'),
        meta: {perm: 'show'},
        children: []
      },
      {
        path: '/supervise/setting',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'supervise', title: '监管配置', icon: 'codes', perm: 'supervise-setting-manager'},
        children: [
          {
            path: '/supervise/setting/whitelist',
            component: () => import('./components/supervise/whitelist/list.vue'),
            meta: {moduleId: 'supervise', title: '监管单位白名单', perm: 'supervise-setting-org-whitelist-query'}
          },
          {
            path: '/supervise/setting/whitelist/range',
            component: () => import('./components/supervise/lessee-whitelist/list.vue'),
            meta: {moduleId: 'supervise', title: '监管租户范围白名单', perm: 'supervise-setting-lessee-whitelist-query'}
          },
          {
            path: '/supervise/setting/whitelist/goods',
            component: () => import('./components/base/white-goods/goods.vue'),
            meta: {moduleId: 'supervise', title: '监管货品白名单', perm: 'supervise-setting-goods-whitelist-query'}
          }
        ]
      },
      {
        path: '/data/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '追溯源数据监控', icon: 'codes', perm: 'data-monitoring-manager'},
        children: [
          {
            path: '/system/goods/import/:id',
            component: () => import('./components/upload/import/import.vue'),
            meta: {moduleId: 'monitoring', title: '追溯码源文件上传监控', perm: 'code-source-upload-log-query', type: 0}
          },
          {
            path: '/retrospect/exception/import/:id',
            component: () => import('./components/upload/exception-code/import.vue'),
            meta: {moduleId: 'monitoring', title: '异常追溯码标记上传监控', perm: 'exception-codes-file-query'}
          },
        ]
      },
      {
        path: '/search',
        component:  () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'search', title: '追溯查询', icon: 'search', perm: 'code-trace-manager'},
        children: [
          {
            path: '/search/code/:id',
            component: () => import('./components/search/code/index.vue'),
            meta: {moduleId: 'search', title: '最小销售单位追溯码查询', perm: 'single-code-trace-query', subMenuId: 'code'}
          },
          {
            path: '/search/goods',
            component: () => import('./components/search/goods/index.vue'),
            meta: {moduleId: 'search', title: '实物追溯查询', perm: 'physical-goods-trace-query', subMenuId: 'goods'},
            children: [
              {
                path: '',
                component: () => import('./components/search/goods/list/index.vue'),
                meta: {moduleId: 'search'}
              },
              {
                path: '/search/goods/:id',
                component: () => import('./components/search/goods/single/index.vue'),
                meta: {moduleId: 'search'}
              }
            ]
          },
          {
            path: '/search/batch',
            component: () => import('./components/search/batch-new/index.vue'),
            meta: {moduleId: 'search', title: '流转分布追溯查询', perm: 'batch-number-trace-query', subMenuId: 'batch'},
            children: [
              {
                path: '',
                component: () => import('./components/search/batch-new/list/index.vue'),
                meta: {moduleId: 'search'}
              },
              {
                path: '/search/batch/:id',
                component: () => import('./components/search/batch-new/single/index.vue'),
                meta: {moduleId: 'search'}
              }
            ]
          }
        ]
      },
      {
        path: '/line/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'line', title: '追溯链数据监管', icon: 'codes', perm: 'data-line-monitoring-manager'},
        children: [
          {
            path: '/search/business',
            component: () => import('./components/search/business/index.vue'),
            meta: {moduleId: 'line', title: '业务追溯数据监管', perm: 'code-biz-trace-watch'}
          },
          {
            path: '/line/monitoring/logistics',
            component: () => import('./components/search/logistics/index.vue'),
            meta: {moduleId: 'line', title: '物流追溯数据监管', perm: 'logistics-trace-query'}
          },
          {
            path: '/line/monitoring/terminal',
            component: () => import('./components/search/use-record/index.vue'),
            meta: {moduleId: 'line', title: '终端追溯监管', perm: 'terminal-trace-query'}
          },
        ]
      },
      {
        path: '/system',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'system', title: '系统管理', icon: 'sys-setting', perm: 'system-config'},
        children: [
          // {
          //   path: '/system/permission',
          //   component: () => import('./components/system/permission/index.vue'),
          //   meta: {moduleId: 'system', title: 'TSS单位账户管理', perm: 'code-org-role-watch'}
          // },
          {
            path: '/system/push/url',
            component: () => import('./components/system/url/index.vue'),
            meta: {moduleId: 'system', title: '推送地址配置', perm: 'code-push-address-query'}
          },
          {
            path: '/system/trace/config',
            component: () => import('./components/system/codeAccess/index.vue'),
            meta: {moduleId: 'system', title: '货品追溯权限分配', perm: 'code-access-query'}
          },
          {
            path: '/system/manage/goods',
            component: () => import('./components/base/operating-goods/goods.vue'),
            meta: {moduleId: 'system', title: '经营货品管理', perm: 'mdm-operating-goods-watch'}
          },
          // {
          //   path: '/system/role',
          //   component: () => import('./components/system/role/index.vue'),
          //   meta: {moduleId: 'system', title: 'TSS角色管理', perm: 'access-role-watch'}
          // },
          // {
          //   path: '/system/user',
          //   component: () => import('./components/system/user/index.vue'),
          //   meta: {moduleId: 'system', title: 'TSS账户管理', perm: 'code-account-query'}
          // },
          // {
          //   path: '/system/role/tbs',
          //   component: () => import('./components/system/tbs-role/index.vue'),
          //   meta: {moduleId: 'system', title: 'TBS角色管理', perm: 'tbs-access-role-manager'}
          // },
          // {
          //   path: '/system/permission/tbs',
          //   component: () => import('./components/system/tbs-permission/index.vue'),
          //   meta: {moduleId: 'system', title: 'TBS单位账户管理', perm: 'tbs-code-permission-manager'}
          // },
          {
            path: '/system/log',
            component: () => import('./components/system/log/index.vue'),
            meta: {moduleId: 'system', title: '系统日志', perm: 'code-system-log-query'}
          },
          {
            path: '/system/search/log',
            component: () => import('./components/system/search/index.vue'),
            meta: {moduleId: 'system', title: '单支追溯查询日志', perm: 'code-access-log-watch'}
          },
        ]
      },
      // 以下是对外站点
      {
        path: '/outSearch',
        component:  () => import('./components/common/parent-route.vue'),
        meta: {moduleId: false, title: '追溯查询-外部', icon: 'search', perm: 'code-trace-manager'},
        children: [
          {
            path: '/outSearch/code/:id',
            component: () => import('./components/outsite/search/code/index.vue'),
            meta: {moduleId: 'outsearch', title: '最小销售单位追溯码查询', perm: 'single-code-trace-query', subMenuId: 'code'}
          },
          {
            path: '/outSearch/goods',
            component: () => import('./components/outsite/search/goods/index.vue'),
            meta: {moduleId: 'outsearch', title: '实物追溯查询', perm: 'physical-goods-trace-query', subMenuId: 'goods'},
            children: [
              {
                path: '',
                component: () => import('./components/outsite/search/goods/list/index.vue'),
                meta: {moduleId: 'outsearch'}
              },
              {
                path: '/outSearch/goods/:id',
                component: () => import('./components/outsite/search/goods/single/index.vue'),
                meta: {moduleId: 'outsearch'}
              }
            ]
          },
          {
            path: '/outSearch/batch',
            component: () => import('./components/outsite/search/batch-new/index.vue'),
            meta: {moduleId: 'outsearch', title: '流转分布追溯查询', perm: 'batch-number-trace-query', subMenuId: 'batch'},
            children: [
              {
                path: '',
                component: () => import('./components/outsite/search/batch-new/list/index.vue'),
                meta: {moduleId: 'outsearch'}
              },
              {
                path: '/outSearch/batch/:id',
                component: () => import('./components/outsite/search/batch-new/single/index.vue'),
                meta: {moduleId: 'outsearch'}
              }
            ]
          }
        ]
      },
      {
        path: '/outline/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: false, title: '追溯链数--外-', icon: 'codes', perm: 'data-line-monitoring-manager'},
        children: [
          {
            path: '/outSearch/business',
            component: () => import('./components/outsite/search/business/index.vue'),
            meta: {moduleId: 'outline', title: '业务追溯数据监管', perm: 'code-biz-trace'}
          },
          {
            path: '/outline/monitoring/logistics',
            component: () => import('./components/outsite/search/logistics/index.vue'),
            meta: {moduleId: 'outline', title: '物流追溯数据监管', perm: 'logistics-trace-query'}
          },
          {
            path: '/outline/monitoring/terminal',
            component: () => import('./components/outsite/search/use-record/index.vue'),
            meta: {moduleId: 'outline', title: '终端追溯监管', perm: 'terminal-trace-query'}
          },
        ]
      },

    ]
  }
];

export const basicRoutes = [
  {path: '/404', component: () => import('./components/error/error_404.vue')},
  {path: '/500', component: () => import('./components/error/error_500.vue')},
  {path: '/login', component: () => import('./components/login/login.vue')},
  {path: '/forget', component: () => import('./components/login/forget.vue')},
  {path: '/code/:id', component: () => import('./components/login/resetpwd.vue')}
];

export const ErrorPage = [
  {path: '*', component: () => import('./components/error/error_404.vue')}
];
