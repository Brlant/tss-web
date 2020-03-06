<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon" v-show="isUploadPage">
          <div class="pull-right">
            <perm label="codes-file-upload">
              <el-button @click="add" type="primary"><i class="el-icon-t-plus"/>添加</el-button>
            </perm>
          </div>
        </div>
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="被监管单位" :span="8" isRequire>
                <el-select filterable placeholder="请输入名称搜监管单位"
                           :clearable="true" v-model="searchCondition.objectOrgId"
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
            <el-col :span="10">
              <oms-form-row :span="3" label="货品">
                <el-select :clearable="true" :remote-method="queryManageGoods" @change="goodsChange"
                           @click.native.once="queryManageGoods('')"
                           filterable placeholder="请输入名称搜索货品"
                           popperClass="custom-select" remote v-model="searchCondition.goodsId"
                           v-show="isUploadPage">
                  <el-option :key="item.id" :label="item.name" :value="item.goodsId" v-for="item in manageGoods">
                    <manage-goods-option :optionItem="item"/>
                  </el-option>
                </el-select>
                <el-select :clearable="true" :filter-method="filterPlatFormGoods"
                           @click.native.once="filterPlatFormGoods()" filterable
                           placeholder="请输入名称搜索货品" popper-class="custom-select"
                           v-model="searchCondition.goodsId" v-show="!isUploadPage">
                  <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                    <div>
                      <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                      <span class="pull-right select-other-info">
                      <dict :dict-group="'typeId'" :dict-key="item.typeId"></dict><span
                        v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'"
                                                                                :dict-key="item.vaccineSign"></dict></span>
                    </span>
                    </div>
                    <div class="clearfix">
                      <span class="pull-left select-other-info" v-if="item.code">货品编号:{{ item.code }}</span>
                      <span class="pull-right select-other-info">规格:{{ item.specifications }}</span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="5" label="批号">
                <el-select :remoteMethod="queryGoodsNumber('searchCondition.goodsId')" clearable filterable
                           placeholder="请输入批号名称搜索批号"
                           remote v-model="searchCondition.batchNumber">
                  <el-option :key="item.id" :label="item.batchNumber" :value="item.batchNumber"
                             v-for="item in goodsBatchNumberList"/>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="8">
              <oms-form-row :span="5" label="">
                <el-button @click="searchInOrder" plain type="primary">查询</el-button>
                <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="order-list">
        <el-row class="order-list-header">
          <el-col :span="6">货品</el-col>
          <el-col :span="6">生产厂商</el-col>
          <el-col :span="4">商品编号/货品编号</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="3">操作时间</el-col>
          <el-col :span="2">解析结果</el-col>
          <!--          <el-col :span="3">操作</el-col>-->
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!orderList.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div class="order-list-body flex-list-dom" v-else="">
          <div :class="[{'active':currentId===item.id}]" @click.prevent="showItem(item)"
               class="order-list-item order-list-item-bg"
               v-for="item in orderList">
            <el-row>
              <el-col :span="6">
                <div>
                  {{item.goodsName }}
                </div>
                <div class="f-grey">
                  {{item.specification }}
                </div>
              </el-col>
              <el-col :span="6">
                {{item.factoryName }}
              </el-col>
              <el-col :span="4">
                {{item.goodsTrackNo }}
                <div class="f-grey">
                  <el-tooltip content="货品编号" placement="right">
                    <span>{{item.goodsCode}}</span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="3">
                <div v-for="b in item.batchNumberList">{{b}}</div>
              </el-col>
              <el-col :span="3">
                {{item.createTime | time }}
              </el-col>
              <el-col :span="2">
                <el-tag type="warning" v-show="item.uploadStatus === '0'">解析中</el-tag>
                <el-tag type="success" v-show="item.uploadStatus === '1'">正常</el-tag>
                <el-tag type="danger" v-show="item.uploadStatus > '1'">异常</el-tag>
              </el-col>
              <!--              <el-col :span="3">-->
              <!--                <des-btn :custom="false" @click="showDomainDialog(item)" icon="share"-->
              <!--                         perm="codes-file-bind-share-domain">数据共享域名-->
              <!--                </des-btn>-->
              <!--              </el-col>-->
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" @current-change="getOrderList"
        layout="prev, pager, next">
      </el-pagination>
    </div>
    <page-right :css="{'width':'800px','padding':0}" :show="showItemRight" @right-close="resetRightBox">
      <add-form :action="action" :defaultIndex="defaultIndex" @change="onSubmit" @close="resetRightBox"
                @refresh="refresh"
                type="0"></add-form>
    </page-right>
    <page-right :css="{'width':'1100px','padding':0}" :show="showDetail" @right-close="resetRightBox">
      <detail :action="action" :currentItem="currentItem" :detailId="currentId" :showDetail="showDetail"
              @change="onSubmit" @close="resetRightBox" type="0"></detail>
    </page-right>
    <page-right :css="{'width':'600px','padding':0}" :show="showDomain" @right-close="resetRightBox">
      <share-form :currentItem="currentItem" :showDetail="showDomain" @change="onSubmit"
                  @close="resetRightBox"></share-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import addForm from './form/InForm.vue';
  import detail from './detail/detail.vue';
  import {http, Order} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import ShareForm from './form/shareForm';

  export default {
    components: {
      addForm, detail, ShareForm
    },
    mixins: [methodsMixin],
    data: function () {
      return {
        loadingData: false,
        showItemRight: false,
        showDetail: false,
        showSearch: true,
        showDomain: false,
        orderList: [],
        filters: {
          type: 0,
          objectOrgId: '',
          goodsId: '',
          batchNumber: '',
          bizType: ''
        },
        searchCondition: {
          objectOrgId: '',
          goodsId: '',
          batchNumber: '',
          bizType: ''
        },
        expectedTime: [],
        orgType: utils.inOrderType,
        activeStatus: 0,
        currentId: '',
        currentItem: {},
        customerList: [], // 查询 疾控中心列表
        orgList: [], // 来源单位列表
        logisticsList: [], // 物流商列表
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        defaultIndex: 0, // 添加订单默认选中第一个tab
        action: '',
        user: {},
        uploadStatusList: utils.uploadStatus,
        urlTitle: {
          0: 'system',
          1: 'retrospect',
          2: 'system/all'
        }
      };
    },
    computed: {
      type() {
        return this.$route.meta.type;
      },
      isUploadPage() {
        return this.type === 1;
      }
    },
    mounted() {
      this.queryPermDownAllFactory('all-code-source-upload-log-query');
      let id = this.$route.params.id;
      id !== 'id' && this.showItem({id});
    },
    watch: {
      type() {
        this.getOrderList(1);
      }
    },
    methods: {
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchCondition);
        this.getOrderList(1);
      },
      resetSearchForm: function () {// 重置表单
        this.pager.count = 0;
        this.orderList = [];
        let temp = {
          objectOrgId: '',
          goodsId: '',
          batchNumber: '',
          bizType: ''
        };
        this.expectedTime = [];
        this.goodsBatchNumberList = [];
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.showDomain = false;
        this.defaultIndex = 0;
        this.action = '';
        this.$router.push(`/${this.urlTitle[this.type]}/goods/import/id`);
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
        this.action = 'add';
      },
      refresh(obj) {
        this.resetRightBox();
        if (obj && obj.id) {
          this.showItem(obj);
        }
        this.getOrderList(1);
      },
      onSubmit: function (order) {
        this.orderList.splice(0, 0, order);
        this.currentId = order.id;
        this.currentItem = order;
      },
      getOrderList: function (pageNo) {
        if (!this.searchCondition.objectOrgId) {
          return this.$notify.info('请选择被监管单位');
        }
        this.pager.currentPage = pageNo;
        let param = {};
        this.loadingData = true;
        param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          type: 1
        });
        delete param.objectOrgId;
        param.objectOrgIdList = [this.searchCondition.objectOrgId];
        let API = {
          0: '/code-regulatory/code-source/pager',
          1: '/code-source',
          2: '/code-source/pager'
        };
        http.get(API[this.type], {params: param}).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      remove: function (order) {
        Order.delete(order.id).then(() => {
          this.getOrderList(1);
        });
      },
      showItem: function (order) {
        this.currentId = order.id;
        this.currentItem = order;
        this.showDetail = true;
        this.$router.push(`/${this.urlTitle[this.type]}/goods/import/` + order.id);
        if (!this.currentItem.goodsName) {
          this.$http.get(`/code-source/${order.id}`).then(res => {
            this.currentItem = Object.assign({}, res.data);
          });
        }
      },
      showDomainDialog: function (order) {
        this.currentItem = order;
        this.showDomain = true;
      },
      goodsChange(val) {
        this.searchCondition.batchNumber = '';
        this.queryGoodsNumber('searchCondition.goodsId')('');
      }
    }
  };
</script>
