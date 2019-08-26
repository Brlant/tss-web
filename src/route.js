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
        path: '/base',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'base', title: '经营资料', icon: 'codes', perm: 'code-data-manager'},
        children: [
          {
            path: '/base/goods',
            component: () => import('./components/base/operating-goods/goods.vue'),
            meta: {moduleId: 'base', title: '经营货品', perm: 'code-batch-number-query'}
          },
          {
            path: '/base/batch/number',
            component: () => import('./components/base/batch/index.vue'),
            meta: {moduleId: 'base', title: '批号管理', perm: 'code-batch-number-query'}
          }
        ]
      },
      {
        path: '/electron/code',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'electron', title: '电子监管码', icon: 'codes', perm: 'code-data-manager'},
        children: [
          {
            path: '/electron/code/construction',
            component: () => import('./components/electronCode/construction/goods.vue'),
            meta: {moduleId: 'electron', title: '编码结构', perm: 'code-batch-number-query'}
          },
          {
            path: '/electron/code/analysis',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'electron', title: '层级关系解析', perm: 'code-batch-number-query'}
          }
        ]
      },
      {
        path: '/gs1',
        component: () => import('./components/upload/code-rule/index.vue'),
        meta: {moduleId: 'gs1', title: 'GS1', perm: 'gs1-rule-query', isUpload: true},
        children: [
          {
            path: '/gs1/construction',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'gs1', title: '编码结构', perm: 'code-batch-number-query'}
          }
        ]
      },
      {
        path: '/data/push',
        component: () => import('./components/upload/code-rule/index.vue'),
        meta: {moduleId: 'data', title: '追溯链数据传送', perm: 'gs1-rule-query', isUpload: true},
        children: [
          {
            path: '/data/push/business',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'data', title: '业务追溯数据传送', perm: 'code-batch-number-query'}
          },
          {
            path: '/data/push/logistics',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'data', title: '物流追溯数据传送', perm: 'code-batch-number-query'}
          },
          {
            path: '/data/push/cool',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'data', title: '冷链追溯数据传送', perm: 'code-batch-number-query'}
          },
          {
            path: '/data/push/terminal',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'data', title: '终端追溯数据传送', perm: 'code-batch-number-query'}
          }
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
          // {
          //   path: '/search/batch',
          //   component: () => import('./components/search/batch/index.vue'),
          //   meta: {moduleId: 'search', title: '批号追溯', perm: 'batch-number-trace'}
          // },
          {
            path: '/search/batch',
            component: () => import('./components/search/batch-new/index.vue'),
            meta: {moduleId: 'search', title: '批号追溯', perm: 'batch-number-trace-query', subMenuId: 'batch'},
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
          },
          {
            path: '/search/company',
            component: () => import('./components/search/batch-new-company/index.vue'),
            meta: {moduleId: 'search', title: '企业批号查询', perm: 'code-biz-trace', subMenuId: 'company'},
            children: [
              {
                path: '',
                component: () => import('./components/search/batch-new-company/list/index.vue'),
                meta: {moduleId: 'search'}
              },
              {
                path: '/search/company/:id',
                component: () => import('./components/search/batch-new-company/single/index.vue'),
                meta: {moduleId: 'search'}
              }
            ]
          },
          {
            path: '/search/business',
            component: () => import('./components/search/business/index.vue'),
            meta: {moduleId: 'search', title: '业务追溯', perm: 'code-biz-trace'}
          },
          {
            path: '/search/use',
            component: () => import('./components/search/use-record/index.vue'),
            meta: {moduleId: 'search', title: '使用/销售记录', perm: 'code-injection-trace'}
          }
          // {
          //   path: '/search/exception',
          //   component: () => import('./components/search/exception/index.vue'),
          //   meta: {moduleId: 'search', title: '异常事件追溯', perm: 'show'}
          // }
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
          },
          {
            path: '/system/search/log',
            component: () => import('./components/system/search/index.vue'),
            meta: {moduleId: 'system', title: '单支追溯查询日志', perm: 'code-access-log-watch'}
          },
          {
            path: '/system/upload/log/:id',
            component: () => import('./components/upload/log/index.vue'),
            meta: {moduleId: 'system', title: '上传记录', perm: 'code-upload-log-query', subMenuId: 'order', isUpload: true}
          },
          {
            path: '/system/goods/import/:id',
            component: () => import('./components/upload/import/import.vue'),
            meta: {moduleId: 'system', title: '源文件上传记录', perm: 'code-source-upload-log-query', type: 0}
          },
          {
            path: '/system/all/goods/import/:id',
            component: () => import('./components/upload/import/import.vue'),
            meta: {moduleId: 'system', title: '全局源文件上传记录', perm: 'code-source-upload-log-query-11', type: 2}
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
