<style lang="scss" scoped="">
  @import '../../../assets/scss/mixins';

  .page-right-part {
    box-sizing: content-box;
    width: 800px;
    padding: 30px 0;
    overflow: auto;

    .title {
      margin-left: 30px;
    }

    .order-info-part {
      padding: 0 50px;
    }

    .goods-info-left {
      width: 330px;
      margin-left: 30px;
      padding: 20px;
      float: left;
      border: 1px solid rgb(238, 238, 238);
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .goods-info-right {
      width: 210px;
      padding: 32px 20px 33px 20px;
      background-color: rgb(238, 238, 238);
      border: 1px solid rgb(238, 238, 238);
      float: left;

      .el-row {
        margin-bottom: 5px;
      }

      margin-bottom: 20px;
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 4px;
      }
    }

    .border-show {
      height: 15px;
      width: 100%;
      border-bottom: 1px solid #777777;
      opacity: 0.2;
      margin-bottom: 10px;
    }

  }

  .exceptionPosition {
    /*margin-left: 40px;*/
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .table {
    .order-list-item {
      color: #999;
      line-height: 20px;
    }

    border-collapse: separate;
    border-spacing: 0;

    > tbody > tr > td {
      border-top: 1px solid #eee;
    }

  }

  .empty-position {
    width: 150px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .w90 {
    width: 90px;
  }

  /*.order-list-item {*/
  /*cursor: pointer;*/
  /*}*/

  .pt10 {
    padding-top: 10px;
  }

  .cursor-span {
    cursor: pointer;
  }

  .opera-btn-bidder {
    a:hover {
      color: $activeColor;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <des-btn class="pull-right" icon="plus" @click="add">添加</des-btn>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix"
                 style="padding-top: 10px" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="监管单位" :span="6">
                <el-select filterable placeholder="请输入名称搜监管单位" remote :remote-method="queryUpAllFactory"
                           :clearable="true" v-model="searchCondition.objectOrgId"
                           popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in allOrgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="租户" :span="6">
                <el-select filterable placeholder="请输入名称搜租户"  remote :remote-method="queryDownAllFactory"
                           :clearable="true" v-model="searchCondition.subjectOrgId"
                           popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in downOrgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchPage">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="9">监管单位</el-col>
          <el-col :span="9">租户</el-col>
          <el-col :span="6">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="dataRows.length === 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item order-list-item-bg" v-for="item in dataRows"
               :class="[{'active':currentItem.id === item.id}]">
            <el-row>
              <el-col :span="9">{{item.objectOrgName}}</el-col>
              <el-col :span="9">{{item.subjectOrgName}}</el-col>
              <el-col :span="6" class="opera-btn-bidder">
                <des-btn  icon="delete" @click="remove(item)">删除</des-btn>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="dataRows.length && !loadingData">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.count" :pageSize="pager.pageSize"
        :page-sizes="[10,20,50,100]"
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pager.currentPage">
      </el-pagination>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'800px','padding':'30px'}">
      <edit-form :showRight="showRight" @close="showRight=false" @change="itemChange"></edit-form>
    </page-right>
  </div>
</template>
<script>
  import editForm from './form/form.vue';
  import {lesseeWhiteList} from '@/resources';
  import MethodMixin from '@/mixins/methodsMixin';

  export default {
    components: {
      editForm
    },
    mixins: [MethodMixin],
    data: function () {
      return {
        showRight: false,
        showSearch: true,
        loadingData: false,
        formItem: {},
        dataRows: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        currentItem: {},
        searchCondition: {
          subjectOrgId: '',
          objectOrgId: ''
        },
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    mounted() {
      this.getPageList(1);
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getPageList(1);
      },
      handleCurrentChange(val) {
        this.getPageList(val);
      },
      getPageList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
        }, this.searchCondition);
        this.loadingData = true;
        lesseeWhiteList.query(params).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      add: function () {
        this.formItem = {};
        this.showRight = true;
      },
      remove: function (item) {
        this.$confirm('是否删除租户 "' + item.subjectOrgName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          lesseeWhiteList.delete(item.id).then(() => {
            this.$notify.success({
              message: '删除成功'
            });
            this.getPageList();
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '删除失败'
            });
          });
        });
      },
      itemChange: function (item) {
        this.getPageList(this.pager.currentPage);
        this.showRight = false;
      },
      formatDate(param) {
        this.searchCondition.year = param ? this.$moment(param).format('YYYY') : '';
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          subjectOrgId: '',
          objectOrgId: ''
        };
        Object.assign(this.searchCondition, temp);
        this.getPageList(1);
      },
      searchPage() {
        this.getPageList();
      }
    }
  };
</script>
