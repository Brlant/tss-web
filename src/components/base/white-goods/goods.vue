<style lang="scss" scoped>
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

  .page-right-part {
    width: 750px;
    padding: 0 0 30px 0;
  }

  .base-pic-item {
    border: 1px solid #eee;
    position: relative;
    cursor: pointer;
    width: 180px;
    margin: 5px;
    padding: 10px;
    font-size: 12px;

    img {
      width: 180px;
      height: 180px;
      display: block;
      background: #ccc;

    }

  }

  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .margin-bottom {
    margin-bottom: 2px !important;
  }

  .border-show {
    height: 20px;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 20px;
  }

  .right-title {
    background-color: #b1b1b1;
    height: 30px;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 20px;
    padding-top: 10px;

  }

  .content-part {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;

    .content-left {
      width: 120px;
      height: 100%;
      float: left;
      background-color: rgb(238, 238, 238);

      .list-style {
        cursor: pointer;
        padding: 8px 5px 8px 5px;

        &:hover {
          background-color: #ffffff;
        }
      }

      .click-it {
        background-color: #ffffff;
      }
    }

    .content-right {
      width: 510px;
      height: 100%;
      float: left;
      padding-top: 10px;

      .hide-content {
        display: none;
      }

      .show-content {
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 4px;
      }

      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .locked {
    border-left: 5px solid #fa0;
    text-indent: -5px;
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .list-item {
    padding-right: 10px;
  }

</style>
<template>
  <div class="order-page">
    <div class="container">

      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-right opera-btn" style="margin-left: 10px">
            <perm label="supervise-setting-goods-whitelist-add">
              <span @click.stop="addType">
                   <a href="#" class="btn-circle" @click.prevent="" style="margin-right: 5px"><i
                     class="el-icon-t-plus"></i> </a>添加
              </span>
            </perm>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
              <i class="el-icon-arrow-up"></i>
              <span v-show="showSearch">收起筛选</span>
              <span v-show="!showSearch">展开筛选</span>
            </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="监管单位">
                <org-select :list="allOrgList" :remoteMethod="queryUpAllFactory" @change="orgChange"
                            placeholder="请输入名称搜索监管单位" v-model="searchCondition.subjectOrgId"></org-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="货品">
                <el-select placeholder="请输入名称搜索货品" v-model="searchCondition.goodsId" filterable clearable
                           popper-class="custom-select" remote :remote-method="filterPlatFormGoods">
                  <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in platformGoods">
                    <div>
                      <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                      <span class="pull-right select-other-info" v-show="item.typeId">
                      {{item.typeId|formatGoodsTypeList}}
                    </span>
                    </div>
                    <div class="clearfix">
                      <span class="select-other-info" v-if="item.code">货品编号:{{ item.code }}</span>
                      <span class="ml-10 select-other-info">规格:{{ item.specifications }}</span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list" style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="5">监管单位</el-col>
          <el-col :span="7">货品编号/名称</el-col>
          <el-col :span="4">货品规格</el-col>
          <el-col :span="5">生产厂商</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="showTypeList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item no-pointer" v-for="item in showTypeList" @click="showInfo(item)"
               :class="['status-no',{'active':activeId===item.id}]">
            <el-row>
              <el-col :span="5">
                <div class="vertical-center">
                  {{ item.subjectOrgName }}
                </div>
              </el-col>
              <el-col :span="7">
                <div class="f-grey">
                  {{item.code}}
                </div>
                <div>
                  {{item.goodsName}}
                </div>
              </el-col>
              <el-col :span="4">
                  {{item.specifications}}
              </el-col>
              <el-col :span="5">
                {{item.factoryName}}
              </el-col>
              <el-col :span="2" class="opera-btn">
                  <des-btn perm="supervise-setting-goods-whitelist-add" icon="delete" @click="remove(item)">删除</des-btn>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="showTypeList.length && !loadingData">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pager.currentPage"
                     :page-sizes="[20,50,100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper"
                     :total="pager.count">
      </el-pagination>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px'}">
      <edit-form :formItem="form" :action="action" :actionType="showRight"
                 @right-close="resetRightBox" @change="onSubmit"></edit-form>
    </page-right>
  </div>
</template>
<script>
  import {BaseInfo, goodsWhiteList} from '@/resources';
  import editForm from './form/form.vue';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    components: {
      editForm
    },
    data: function () {
      return {
        loadingData: true,
        showRight: false,
        showTypeSearch: false,
        showSearch: true,
        showTypeList: [],
        form: {},
        action: '',
        currentItem: {},
        activeStatus: 0,
        orgType: {
          0: {'title': '待审核', 'num': 0, 'auditStatus': '0'},
          1: {'title': '正常', 'num': 0, 'auditStatus': '1'},
          2: {'title': '审核不通过', 'num': 0, 'auditStatus': '2'}
        },
        filters: {
          subjectOrgId: '',
          goodsId: '',
          auditStatus: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        searchCondition: {
          subjectOrgId: '',
          goodsId: '',
          auditStatus: ''
        },
        activeId: '',
        customerList: []
      };
    },
    computed: {
      typeIdList() {
        return this.$getDict('typeId');
      }
    },
    filters: {
      formatIsUse: function (value) {
        return value ? '是' : '否';
      }
    },
    mounted() {
      this.getGoodsList(1);
    },
    watch: {
      filters: {
        handler() {
          this.getGoodsList(1);
        },
        deep: true
      }
    },
    methods: {
      showInfo: function (item) {
        this.activeId = item.id;
      },
      remove: function (item) {
        this.$confirm('是否删除货品 "' + item.goodsName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          goodsWhiteList.delete(item.id).then(() => {
            this.$notify.success({
              message: '删除成功'
            });
            this.getGoodsList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '删除失败'
            });
          });
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getGoodsList(1);
      },
      handleCurrentChange(val) {
        this.getGoodsList(val);
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query}).then(res => {
          this.customerList = res.data.list;
        });
      },
      orgChange: function () {
        this.searchCondition.id = '';
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchCondition);
        this.getGoodsList(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          subjectOrgId: '',
          goodsId: '',
          auditStatus: ''
        };
        this.customerList = [];
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.getGoodsList(1);
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
        this.action = 'add';
        this.form = {
          name: '',
          subjectOrgId: '',
          goodsIdList: []
        };
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getGoodsList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          deleteFlag: false
        }, this.filters);
        this.loadingData = true;
        goodsWhiteList.query(params).then(res => {
          this.showTypeList = res.data.list;
          if (res.data.list.length > 0) {
            this.currentItem = Object.assign({orgGoodsDto: {}, list: []}, this.showTypeList[0]);
          } else {
            this.currentItem = Object.assign({orgGoodsDto: {id: ''}, list: []});
          }
          this.loadingData = false;
          this.pager.count = res.data.count;
        });
      },
      onSubmit: function () {
        this.getGoodsList();
      }
    }
  };
</script>
