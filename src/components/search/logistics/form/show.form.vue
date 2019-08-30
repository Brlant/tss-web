<style lang="scss" scoped>
  @import "../../../../assets/scss/mixins";

  $leftWidth: 200px;

  .el-form .el-select {
    display: block;
  }

  .table-product-list {
    font-size: 12px;

    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
  }

  .min-row {
    .oms-row {
      margin-bottom: 10px;
    }
  }

  .border-bottom {
    border-bottom: 1px solid #f1f1f1;
  }

  .add-btn {
    margin-left: 10px;
    cursor: pointer;

    :hover {
      color: #ff3300;
    }
  }
</style>

<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">物流信息</template>
    <template slot="content">
      <div v-if="loadingData">
        <oms-loading :loading="loadingData"></oms-loading>
      </div>
      <div v-else-if="!currentOrder.id" class="empty-info">暂无数据</div>
      <div v-else>
        <form-show-part :pageSetsItem="getPageSizeItem(0)" :currentTab="currentTab">
          <div slot="content">
            <el-row style="margin-bottom:0">
              <el-col :span="12">
                <oms-row label="业务单据号" :span="7">{{ currentOrder.orderNo }}</oms-row>
                <oms-row label="业务类型" :span="7"> {{filterBizType(currentOrder.bizType)}}</oms-row>
                <oms-row label="来源单位" :span="7">{{currentOrder.upstreamOrgName}}</oms-row>
                <oms-row label="去向单位" :span="7">{{currentOrder.downstreamOrgName }}</oms-row>
                <oms-row label="业务时间" :span="7">{{currentOrder.bizTime | time}}</oms-row>
                <oms-row label='物流方式' :span="7">
                  <dict :dict-group="currentOrder.bizType.charAt(0) === '1' ? 'transportationMeans' : 'outTransportMeans'" :dict-key="currentOrder.logisticsMode"></dict>
                </oms-row>
                <oms-row label='运输条件' :span="7">
                  <dict :dict-group="'transportationCondition'"
                        :dict-key="currentOrder.transportationCondition"></dict>
                </oms-row>
                <oms-row label='温度是否合格' :span="7" v-show="typeof currentOrder.temperatureQualified === 'boolean'">
                  <span v-show="currentOrder.temperatureQualified">合格</span>
                  <span v-show="!currentOrder.temperatureQualified">不合格</span>
                </oms-row>
              </el-col>
              <el-col :span="12">
                <oms-row label="作业号" :span="7"> {{currentOrder.taskNo}}</oms-row>
                <oms-row label='作业单位' :span="7">{{currentOrder.taskOperateOrg}}</oms-row>
                <oms-row label='上传人' :span="7" v-show="currentOrder.uploadPersonName">
                  {{currentOrder.uploadPersonName}}
                </oms-row>
                <oms-row label='上传单位' :span="7" v-show="currentOrder.uploadOrgName">{{currentOrder.uploadOrgName}}
                </oms-row>
                <oms-row label="上传时间" :span="7" v-show="currentOrder.uploadTime">{{currentOrder.uploadTime | time}}
                </oms-row>
              </el-col>
            </el-row>
          </div>
        </form-show-part>
        <form-show-part :pageSetsItem="getPageSizeItem(1)" :currentTab="currentTab">
          <div slot="content">
            <el-table :data="currentOrder.detailList" style="width: 100%" class="mt-10 header-list">
              <el-table-column prop="operatorName" label="操作人" min-width="100"/>
              <el-table-column prop="address" label="地址" min-width="150"/>
              <el-table-column prop="time" label="处理时间" min-width="120">
                <span slot-scope="scope">{{scope.row.time | time}}</span>
              </el-table-column>
              <el-table-column prop="remark" label="备注信息" min-width="150"/>
            </el-table>
          </div>
        </form-show-part>
      </div>
    </template>
  </dialog-template>
</template>

<script>
  import {logisticsSearch} from '@/resources';

  export default {
    name: 'showOrder',
    props: {
      currentItem: Object,
      filterBizType: Function
    },
    data: function () {
      return {
        loadingData: false,
        currentOrder: {},
        currentTab: {},
        dataList: []
      };
    },
    computed: {
      pageSets() {
        return [
          {name: '基础信息', key: 0},
          {name: '作业信息', key: 1},
        ];
      }
    },
    watch: {
      currentItem: function (val) {
        this.currentOrder = val;
        this.queryDetail();
      }
    },
    methods: {
      getPageSizeItem(key) {
        return this.pageSets.filter(f => f.key === key)[0];
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('close');
      },
      queryDetail() {
        if (!this.currentOrder.id) return;
        this.loadingData = true;
        logisticsSearch.queryDetail(this.currentOrder.id).then(res => {
          this.dataList = res.data.data;
          this.loadingData = false;
        });
      }
    }
  };
</script>
