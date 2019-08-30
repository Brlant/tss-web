<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group">
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="7">
              <oms-form-row :span="8" label="业务单据号">
                <oms-input placeholder="请输入业务单据号" type="text" v-model="searchCondition.objectNo"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row :span="8" label="业务类型">
                <el-select filterable placeholder="请选择业务类型" v-model="searchCondition.bizType">
                  <el-option :key="item.key" :label="item.label" :value="item.value" v-for="item in bizTypes"/>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row :span="6" label="">
                <el-button @click="searchInOrder" plain type="primary">查询</el-button>
                <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list">
        <el-row class="order-list-header">
          <el-col :span="2">业务类型</el-col>
          <el-col :span="3">业务单据号</el-col>
          <el-col :span="4">来源单位</el-col>
          <el-col :span="4">去向单位</el-col>
          <el-col :span="3">业务时间</el-col>
          <el-col :span="4">作业号</el-col>
          <el-col :span="4">作业单位</el-col>
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
          <div :class="[{'active':currentItem.id===item.id}]" @click.prevent="showItem(item)"
               class="order-list-item order-list-item-bg"
               v-for="item in orderList">
            <el-row type="flex">
              <el-col :span="2">{{filterBizType(item.bizType)}}</el-col>
              <el-col :span="3" class="R">{{item.orderNo}}</el-col>
              <el-col :span="4">{{item.upstreamOrgName }}</el-col>
              <el-col :span="4">{{item.downstreamOrgName }}</el-col>
              <el-col :span="3">{{item.bizTime | minute }}</el-col>
              <el-col :span="4">{{item.taskNo}}</el-col>
              <el-col :span="4">{{item.taskOperateOrg}}</el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
      <el-pagination
        :current-page="pager.currentPage" :pageSize="pager.pageSize" :total="pager.count"
        @current-change="handleCurrentChange" @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next">
      </el-pagination>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail" @right-close="resetRightBox"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :filterBizType="filterBizType" :currentItem="currentItem" @close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import showForm from './form/show.form.vue';
  import {logisticsSearch} from '@/resources';
  import DataMixin from '@/mixins/dataMixin';

  export default {
    components: {showForm},
    mixins: [DataMixin],
    data: function () {
      return {
        loadingData: true,
        showDetail: false,
        showSearch: true,
        orderList: [],
        filters: {
          orgId: '',
          objectNo: '',
          bizType: ''
        },
        searchCondition: {
          orgId: '',
          objectNo: '',
          bizType: ''
        },
        activeStatus: 0,
        currentItem: {},
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        }
      };
    },
    mounted() {
      this.getOrderList(1);
    },
    watch: {
      filters: {
        handler: function () {
          // this.getOrderList(1);
        },
        deep: true
      }
    },
    methods: {
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchCondition);
        this.getOrderList(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          objectNo: '',
          bizType: ''
        };
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
        this.getOrderList(1);
      },
      resetRightBox: function () {
        this.currentItem = {};
        this.showDetail = false;
        // this.$router.push('/search/business');
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getOrderList(1);
      },
      handleCurrentChange(val) {
        this.getOrderList(val);
      },
      getOrderList: function (pageNo) {
        if (pageNo === 1) {
          this.pager.count = 0;
        }
        this.pager.currentPage = pageNo;
        let params = {};
        this.loadingData = true;
        params = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        logisticsSearch.query(params).then(res => {
          this.orderList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      showItem: function (order) {
        this.currentItem = order;
        this.showDetail = true;
        // this.$router.push(`/search/business/${order.id}`);
      },
      formatTimeAry(times, index, str) {
        if (!times) return;
        return this.formatTime(times[index], str);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      }
    }
  };
</script>
