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
        meta: {moduleId: 'supervise', title: '监管配置', icon: 'codes', perm: 'code-data-manager'},
        children: [
          {
            path: '/supervise/setting/whitelist',
            component: () => import('./components/supervise/whitelist/list.vue'),
            meta: {moduleId: 'supervise', title: '监管单位白名单', perm: 'code-batch-number-query'}
          },
          {
            path: '/supervise/setting/whitelist/range',
            component: () => import('./components/supervise/lessee-whitelist/list.vue'),
            meta: {moduleId: 'supervise', title: '监管租户范围白名单', perm: 'code-batch-number-query'}
          }
        ]
      },
      {
        path: '/data/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '追溯源数据监控', icon: 'codes', perm: 'code-data-manager'},
        children: [
          {
            path: '/system/goods/import/:id',
            component: () => import('./components/upload/import/import.vue'),
            meta: {moduleId: 'monitoring', title: '源文件上传记录', perm: 'code-source-upload-log-query', type: 0}
          },
          {
            path: '/retrospect/exception/import/:id',
            component: () => import('./components/upload/exception-code/import.vue'),
            meta: {moduleId: 'monitoring', title: '异常码标记', perm: 'exception-codes-file-query'}
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
            meta: {moduleId: 'search', title: '追溯码查询', perm: 'single-code-trace-query', subMenuId: 'code'}
          },
          {
            path: '/search/goods',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'matter', title: '实物追溯查询', perm: 'code-batch-number-query'}
          },
          {
            path: '/search/use',
            component: () => import('./components/search/use-record/index.vue'),
            meta: {moduleId: 'search', title: '使用/销售记录', perm: 'code-injection-trace'}
          }
        ]
      },
      {
        path: '/line/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'line', title: '追溯链数据监管', icon: 'codes', perm: 'code-data-manager'},
        children: [
          {
            path: '/search/business',
            component: () => import('./components/search/business/index.vue'),
            meta: {moduleId: 'line', title: '业务追溯', perm: 'code-biz-trace'}
          },
          {
            path: '/line/monitoring/logistics',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'line', title: '物流追溯数据监管', perm: 'code-batch-number-query'}
          },
          {
            path: '/line/monitoring/terminal',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'matter', title: '终端追溯监管', perm: 'code-batch-number-query'}
          },
        ]
      },
      {
        path: '/sys/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'sys', title: '系统监控', icon: 'codes', perm: 'code-data-manager'},
        children: [
          {
            path: '/sys/monitoring/goods',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'sys', title: '实物追溯查询作业监控', perm: 'code-batch-number-query'}
          },
          {
            path: '/sys/monitoring/flow',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'sys', title: '流转追溯查询作业监控', perm: 'code-batch-number-query'}
          },
        ]
      },
      {
        path: '/system',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'system', title: '系统管理', icon: 'sys-setting', perm: 'system-config'},
        children: [
          {
            path: '/system/permission',
            component: () => import('./components/system/permission/index.vue'),
            meta: {moduleId: 'system', title: '单位账户管理', perm: 'code-org-role-watch'}
          },
          {
            path: '/system/push/url',
            component: () => import('./components/system/url/index.vue'),
            meta: {moduleId: 'system', title: '推送地址配置', perm: 'code-push-address-query'}
          },
          {
            path: '/system/role',
            component: () => import('./components/system/role/index.vue'),
            meta: {moduleId: 'system', title: '角色管理', perm: 'access-role-watch'}
          },
          {
            path: '/system/user',
            component: () => import('./components/system/user/index.vue'),
            meta: {moduleId: 'system', title: '账户管理', perm: 'code-account-query'}
          },
          {
            path: '/system/log',
            component: () => import('./components/system/log/index.vue'),
            meta: {moduleId: 'system', title: '系统日志', perm: 'code-system-log-query'}
          }
        ]
      }
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
