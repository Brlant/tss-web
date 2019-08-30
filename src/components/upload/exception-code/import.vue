<template>
  <div class="order-page">
    <div class="container">
      <search-part @add="add" @batchNumberAdd="batchNumberAdd" @search="searchResult"></search-part>
      <div class="order-list">
        <el-row class="order-list-header">
          <el-col :span="4">发生时间</el-col>
          <el-col :span="4">上报时间</el-col>
          <el-col :span="6">上报人</el-col>
          <el-col :span="7">上报单位</el-col>
          <el-col :span="3">上报作业状态</el-col>
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
          <div :class="[{'active':currentId===item.id}]" @click.prevent="showItem(item)" class="order-list-item order-list-item-bg"
               v-for="item in orderList">
            <el-row>
              <el-col :span="4">{{item.happenTime | minute}}</el-col>
              <el-col :span="4">{{item.uploadTime | minute}}</el-col>
              <el-col :span="6">{{item.creatorName}}</el-col>
              <el-col :span="7">
                {{item.uploadOrgName}}
              </el-col>
              <el-col :span="3">
                <el-tag type="warning" v-show="item.status === '0'">解析中</el-tag>
                <el-tag type="success" v-show="item.status === '1'">已完成</el-tag>
                <el-tag type="danger" v-show="item.status === '2'">异常</el-tag>
              </el-col>
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
      <add-form :action="action" :defaultIndex="defaultIndex" @close="resetRightBox" @refresh="refresh"
                type="0"></add-form>
    </page-right>
    <page-right :css="{'width':'1100px','padding':0}" :show="showDetail" @right-close="resetRightBox">
      <detail :action="action" :currentItem="currentItem" :detailId="currentId"
              :showDetail="showDetail" @close="resetRightBox" @refresh="getOrderList(pager.currentPage)"
              type="0"></detail>
    </page-right>
    <page-right :css="{'width':'800px','padding':0}" :show="defaultIndex === 2" @right-close="resetRightBox">
      <batch-number-form :defaultIndex="defaultIndex" @close="resetRightBox" @refresh="refresh"></batch-number-form>
    </page-right>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import addForm from './form/InForm.vue';
  import detail from './detail/detail.vue';
  import {http} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import SearchPart from './search';
  import batchNumberForm from './form/batch-number-form';

  export default {
    components: {
      addForm, detail, SearchPart, batchNumberForm
    },
    mixins: [methodsMixin],
    data: function () {
      return {
        loadingData: true,
        showItemRight: false,
        showDetail: false,
        orderList: [],
        filters: {},
        expectedTime: [],
        orgType: utils.inOrderType,
        activeStatus: 0,
        currentId: '',
        currentItem: {},
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        defaultIndex: 0, // 添加订单默认选中第一个tab
        action: ''
      };
    },
    mounted() {
      this.getOrderList(1);
      let id = this.$route.params.id;
      id !== 'id' && this.showItem({id});
    },
    watch: {
      filters: {
        handler: function () {
          this.getOrderList(1);
        },
        deep: true
      }
    },
    methods: {
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search, {
          uploadOrg: null
        });
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.action = '';
        this.$router.push('/retrospect/exception/import/id');
      },
      add: function () {
        this.showItemRight = true;
        this.defaultIndex = 1;
        this.action = 'add';
      },
      batchNumberAdd: function () {
        this.defaultIndex = 2;
      },
      refresh(obj) {
        this.resetRightBox();
        if (obj && obj.id) {
          this.showItem(obj);
        }
        this.getOrderList(1);
      },
      getOrderList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let param = {};
        this.loadingData = true;
        param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        http.get('/code-regulatory/code-exception/pager', {params: param}).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      showItem: function (order) {
        this.currentId = order.id;
        this.currentItem = order;
        this.showDetail = true;
        this.$router.push('/retrospect/exception/import/' + order.id);
      }
    }
  };
</script>
