<style lang="scss" scoped>

  .el-form .el-select {
    display: block;
  }

  .tr-bg {
    :hover {
      background: #fff;
    }
  }

</style>
<template>
  <div>
    <status-list :activeStatus="filters.status" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass"></status-list>
    <div class="container d-table">
      <div class="d-table-right">
        <div class="d-table-col-wrap">

        <span class="pull-right">
          <span class="btn-search-toggle open" v-show="showSearch">
            <single-input v-model="filters.keyWord" placeholder="请输入名称搜索"
                          :showFocus="showSearch"></single-input>
            <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
          </span>
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
              <i class="el-icon-t-search"></i>
          </a>
          <perm label="code-account-add">
                <a href="#" class="btn-circle" @click.stop.prevent="add">
                    <i class="el-icon-t-plus"></i>
                </a>
          </perm>
        </span>
          <table class="table table-hover">
            <thead>
            <tr>
              <th>姓名</th>
              <th>角色</th>
              <th>手机号码</th>
              <th>邮箱</th>
              <th>状态</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loadingData">
              <td colspan="6">
                <oms-loading :loading="loadingData"></oms-loading>
              </td>
            </tr>
            <tr v-else-if="!dataRows.length">
              <td colspan="6">
                <div class="empty-info">
                  暂无信息
                </div>
              </td>
            </tr>
            <tr v-else="" v-for="row in dataRows" :keys="row.id">
              <td>
                {{row.name}}
                <el-tag type="success" v-show="row.adminFlag">主账号</el-tag>
              </td>
              <td>
                {{ row.list | formatRole }}
              </td>
              <td>
                {{row.phone}}
              </td>
              <td>
                {{row.email}}
              </td>

              <td>
                <dict :dict-group="'orgUserStatus'" :dict-key="formatStatus(row.status)"></dict>
              </td>
              <td class="list-op">
                <perm label="code-account-edit">
                  <a href="#" @click.stop.prevent="edit(row)"><i
                    class="el-icon-t-edit"></i>编辑</a>

                  <oms-forbid :item="row" @forbided="forbid" :tips='"确认停用用户\""+row.name+"\"?"'
                              v-show="row.status !== '2' ">
                    <i class="el-icon-t-forbidden"></i>停用
                  </oms-forbid>
                  <oms-forbid :item="row" @forbided="useNormal" :tips='"确认启用用户\""+row.name+"\"?"'
                              v-show="row.status=== '2' "><i class="el-icon-t-start" v-show="!row.adminFlag"></i>启用
                  </oms-forbid>
                </perm>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="text-center" v-show="pager.count>pager.pageSize">
            <el-pagination
              layout="prev, pager, next"
              :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"
              :current-page="pager.currentPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {User} from '../../../resources';
  import editForm from './form/form.vue';

  export default {
    components: {
      editForm
    },
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        loadingData: false,
        dataRows: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        filters: {
          status: '1',
          keyWord: ''
        },
        form: {list: [{roleId: ''}]},
        formTitle: '新增',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        orgType: {
          0: {'title': '所有', 'num': '', 'status': null},
          1: {'title': '正常', 'num': '', 'status': '1'},
          2: {'title': '未激活', 'num': '', 'status': '0'},
          3: {'title': '停用', 'num': '', 'status': '2'}
        },
        orgName: '',
        roleMenu: [],
        currentItem: {}
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    filters: {
      formatRole: function (list) {
        return list.map(m => m.title).join('，');
      }
    },
    mounted() {
      this.getPageList(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      },
      user(val) {
        if (val.userCompanyAddress) {
          this.getPageList(1);
        }
      }
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      changeType(item, key) {
        this.filters.status = item.status;
      },
      isShowIcon(item, key, activeStatus) {
        return item.status === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.status === activeStatus
        };
      },
      getPageList: function (pageNo) {
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        this.$http.get('/code-account/user', {params}).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
        this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        params = Object.assign({}, params, {status: null});
        this.$http.get('/code-account/user/count', {params}).then(res => {
          let count = 0;
          Object.keys(res.data).forEach(k => {
            count += res.data[k];
          });
          this.orgType[0].num = count;
          this.orgType[1].num = res.data['valid'];
          this.orgType[2].num = res.data['inactive'];
          this.orgType[3].num = res.data['stop'];
        });
      },
      add: function () {
        this.action = 'add';
        this.formTitle = '新增';
        this.form = {
          list: [{roleId: ''}]
        };
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑';
        this.oldItem = item;
        this.form = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      forbid: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '2';
        User.stopUser(itemTemp.id).then(() => {
          item.status = '2';
          this.$notify.success({
            title: '成功',
            message: '已经停用用户"' + itemTemp.name + '"'
          });
        });
      },
      useNormal: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '0';
        User.enableUser(itemTemp.id).then(() => {
          item.status = '0';
          this.$notify.success({
            title: '成功',
            message: '已成功启用用户"' + item.name + '"'
          });
        });
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
      },
      itemChange: function (formData) {
        let index = -1;
        this.dataRows.forEach((f, key) => {
          if (f.id === formData.id) {
            index = key;
          }
        });
        if (index !== -1) {
          this.dataRows.splice(index, 1, formData);
        } else {
          this.getPageList(1);
        }
        this.showRight = false;
      }
    }
  };
</script>
