export default [
  {
    id: 'supervise-setting-manager',
    label: '监管配置',
    children: [
      {
        id: 'supervise-setting-org-whitelist-manager',
        label: '监管单位白名单',
        children: [
          {
            id: 'supervise-setting-org-whitelist-query',
            label: '查看监管单位白名单',
          },
          {
            id: 'supervise-setting-org-whitelist-add',
            label: '新增监管单位白名单',
          },
          {
            id: 'supervise-setting-org-whitelist-delete',
            label: '删除监管单位白名单',
          }
        ]
      },
      {
        id: 'supervise-setting-lessee-whitelist-manager',
        label: '监管租户范围白名单',
        children: [
          {
            id: 'supervise-setting-lessee-whitelist-query',
            label: '查看监管租户范围白名单',
          },
          {
            id: 'supervise-setting-lessee-whitelist-add',
            label: '新增监管租户范围白名单',
          },
          {
            id: 'supervise-setting-lessee-whitelist-delete',
            label: '删除监管租户范围白名单',
          }
        ]
      },
      {
        id: 'supervise-setting-goods-whitelist-manager',
        label: '监管货品白名单',
        children: [
          {
            id: 'supervise-setting-goods-whitelist-query',
            label: '查看监管货品白名单',
          },
          {
            id: 'supervise-setting-goods-whitelist-add',
            label: '新增监管货品白名单',
          },
          {
            id: 'supervise-setting-goods-whitelist-delete',
            label: '删除监管货品白名单',
          }
        ]
      }
    ]
  },
  {
    id: 'data-monitoring-manager',
    label: '追溯源数据监控',
    children: [
      {
        id: 'code-source-upload-log-query',
        label: '查看追溯码源文件上传监控'
      },
      {
        id: 'exception-codes-file-query',
        label: '查看异常追溯码标记上传监控'
      }
    ]
  },
  {
    'id': 'code-trace-manager',
    'parentId': null,
    'label': '追溯查询',
    'sort': 2,
    'children': [
      {
        'id': 'code-trace-query',
        'parentId': 'code-trace-manager',
        'label': '最小销售单位追溯码查询',
        'sort': 1,
        'children': [{
          'id': 'single-code-trace-query',
          'parentId': 'code-trace-query',
          'label': '查询最小销售单位追溯码查询',
          'sort': 1,
          'children': null,
          'leaf': true
        }, {
          'id': 'code-trace-injection-query',
          'parentId': 'code-trace-query',
          'label': '查询接种日志信息',
          'sort': 2,
          'children': null,
          'leaf': true
        }, {
          'id': 'code-trace-log-delete',
          'parentId': 'code-trace-query',
          'label': '删除追溯码日志',
          'sort': 1,
          'children': null,
          'leaf': true
        },  {
          'id': 'code-trace-query-all',
          'parentId': 'code-trace-query',
          'label': '查询所有的追溯码日志信息',
          'sort': 2,
          'children': null,
          'leaf': true
        }, {
          'id': 'code-trace-query-goods-all',
          'parentId': 'code-trace-query',
          'label': '查询所有货品的追溯码日志信息',
          'sort': 2,
          'children': null,
          'leaf': true
        }, {
          'id': 'code-trace-exception-query',
          'parentId': 'code-trace-query',
          'label': '查询异常日志信息',
          'sort': 2,
          'children': null,
          'leaf': true
        }, {
          'id': 'wechat-single-code-trace-query',
          'parentId': 'code-trace-query',
          'label': '微信小程序查询单只追溯码',
          'sort': 1,
          'children': null,
          'leaf': true
        }, {
          'id': 'code-trace-json-download',
          'parentId': 'code-trace-query',
          'label': '下载json数据',
          'sort': 2,
          'children': null,
          'leaf': true
        }, {
          'id': 'code-trace-inventory-surplus-query',
          'parentId': 'code-trace-query',
          'label': '查询盘盈入库日志信息',
          'sort': 2,
          'children': null,
          'leaf': true
        }],
        'leaf': false
      },
      {
        'id': 'physical-goods-trace',
        'parentId': 'code-trace-manager',
        'label': '实物追溯查询',
        'sort': 2,
        'children': [{
          'id': 'physical-goods-trace-query',
          'parentId': 'physical-goods-trace',
          'label': '查看实物追溯查询',
          'sort': 1,
          'children': null,
          'leaf': true
        }, {
          'id': 'physical-goods-trace-add',
          'parentId': 'physical-goods-trace',
          'label': '新增实物追溯查询任务',
          'sort': 1,
          'children': null,
          'leaf': true
        }],
        'leaf': false
      },
      {
        'id': 'batch-number-trace',
        'parentId': 'code-trace-manager',
        'label': '流转分布追溯查询',
        'sort': 2,
        'children': [{
          'id': 'batch-number-trace-query',
          'parentId': 'batch-number-trace',
          'label': '查看流转分布追溯查询',
          'sort': 1,
          'children': null,
          'leaf': true
        }, {
          'id': 'batch-number-trace-add',
          'parentId': 'batch-number-trace',
          'label': '新增流转分布追溯查询任务',
          'sort': 1,
          'children': null,
          'leaf': true
        }],
        'leaf': false
      },
    ],
    'leaf': false
  },
  {
    id: 'data-line-monitoring-manager',
    label: '追溯源数据监控',
    children: [
      {
        id: 'code-biz-trace',
        label: '业务追溯数据监管'
      },
      {
        id: 'logistics-trace-query',
        label: '物流追溯数据监管'
      },
      {
        id: 'terminal-trace-query',
        label: '终端追溯监管'
      }
    ]
  },
  {
    id: 'query-all-supervise-unit',
    label: '查看所有单位'
  },
  {
    id: 'query-all-supervise-goods',
    label: '查看所有货品'
  },
  {
    'id': 'system-config',
    'parentId': null,
    'label': '系统管理',
    'sort': 3,
    'children': [
      {
        'id': 'code-access-log-watch',
        'parentId': 'code-system-manager',
        'label': '单支追溯查询日志',
        'sort': 5,
        'children': null,
        'leaf': true
      },
      {
      'id': 'code-system-log-query',
      'parentId': 'code-system-manager',
      'label': '系统日志',
      'sort': 5,
      'children': null,
      'leaf': true
    }, {
      'id': 'code-account-manager',
      'parentId': 'code-system-manager',
      'label': 'TSS账户管理',
      'sort': 4,
      'children': [{
        'id': 'code-account-query',
        'parentId': 'code-account-manager',
        'label': '查看账户',
        'sort': 3,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-account-add',
        'parentId': 'code-account-manager',
        'label': '新增账户',
        'sort': 1,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-account-edit',
        'parentId': 'code-account-manager',
        'label': '编辑账户',
        'sort': 2,
        'children': null,
        'leaf': true
      }],
      'leaf': false
    }, {
      'id': 'code-push-address-manager',
      'parentId': 'code-system-manager',
      'label': '推送地址管理',
      'sort': 2,
      'children': [{
        'id': 'code-push-address-add',
        'parentId': 'code-push-address-manager',
        'label': '推送地址新增',
        'sort': 2,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-push-address-query',
        'parentId': 'code-push-address-manager',
        'label': '推送地址查询',
        'sort': 1,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-oauth-client-details-watch',
        'parentId': 'code-push-address-manager',
        'label': '查看API账号',
        'sort': 5,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-push-address-edit',
        'parentId': 'code-push-address-manager',
        'label': '推送地址编辑',
        'sort': 3,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-push-address-delete',
        'parentId': 'code-push-address-manager',
        'label': '推送地址删除',
        'sort': 4,
        'children': null,
        'leaf': true
      }],
      'leaf': false
    }, {
      'id': 'access-role-manager',
      'parentId': 'code-system-manager',
      'label': 'TSS角色管理',
      'sort': 3,
      'children': [{
        'id': 'codes-access-role-start',
        'parentId': 'codes-user-role-manager',
        'label': '启用角色',
        'sort': 3,
        'children': null,
        'leaf': true
      }, {
        'id': 'access-role-edit',
        'parentId': 'codes-user-role-manager',
        'label': '编辑角色',
        'sort': 2,
        'children': null,
        'leaf': true
      }, {
        'id': 'codes-access-role-stop',
        'parentId': 'codes-user-role-manager',
        'label': '停用角色',
        'sort': 4,
        'children': null,
        'leaf': true
      }, {
        'id': 'access-role-add',
        'parentId': 'codes-user-role-manager',
        'label': '新增角色',
        'sort': 1,
        'children': null,
        'leaf': true
      }, {
        'id': 'codes-access-role-delete',
        'parentId': 'codes-user-role-manager',
        'label': '删除角色',
        'sort': 5,
        'children': null,
        'leaf': true
      }, {
        'id': 'access-role-watch',
        'parentId': 'codes-user-role-manager',
        'label': '查看角色',
        'sort': 6,
        'children': null,
        'leaf': true
      }],
      'leaf': false
    },
      {
      'id': 'code-permission-manager',
      'parentId': 'code-system-manager',
      'label': 'TSS单位账户管理',
      'sort': 1,
      'children': [{
        'id': 'code-org-user-edit',
        'parentId': 'code-permission-manager',
        'label': '编辑单位账户',
        'sort': 2,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-org-role-watch',
        'parentId': 'code-permission-manager',
        'label': '查看权限配置',
        'sort': 5,
        'children': null,
        'leaf': true
      }, {
        'id': 'code-org-user-add',
        'parentId': 'code-permission-manager',
        'label': '新增单位账户',
        'sort': 1,
        'children': null,
        'leaf': true
      }],
      'leaf': false
    }, {
        id: 'code-access-manager',
        label: '货品追溯权限分配',
        children: [
          {
            id: 'code-access-add',
            label: '新增货品追溯权限'
          },
          {
            id: 'code-access-query',
            label: '查看货品追溯权限'
          },
          {
            id: 'code-access-delete',
            label: '删除货品追溯权限'
          },
        ]
      },{
        'id': 'mdm-operating-goods-manager',
        'parentId': null,
        'label': '经营货品',
        'sort': 3,
        'children': [
          {
            'id': 'mdm-operating-goods-watch',
            'parentId': 'mdm-operating-goods-manager',
            'label': '查看经营货品',
            'sort': null,
            'children': null,
            'leaf': true
          },{
            'id': 'mdm-operating-goods-audit',
            'parentId': 'mdm-operating-goods-manager',
            'label': '审核经营货品',
            'sort': null,
            'children': null,
            'leaf': true
          }],
        'leaf': false
      },
      {
        'id': 'tbs-access-role-manager',
        'parentId': 'code-system-manager',
        'label': 'TBS角色管理',
        'sort': 3,
        'leaf': false
      }, {
        'id': 'tbs-code-permission-manager',
        'parentId': 'code-system-manager',
        'label': 'TBS单位账户管理',
        'sort': 1,
        'leaf': false
      }],
    'leaf': false
  }];
