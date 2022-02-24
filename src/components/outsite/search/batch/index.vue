<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">业务时间</el-col>
        <el-col :span="5">货品</el-col>
        <el-col :span="3">批号</el-col>
        <el-col :span="2">业务类型</el-col>
        <el-col :span="5">来源单位</el-col>
        <el-col :span="5">去向单位</el-col>
        <el-col :span="1">数量</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="!dataList.length">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[{'active':currentItemId===item.id}]" @click="showItemDetail(item)" class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="3">{{item.bizTime | time}}</el-col>
            <el-col :span="5">{{item.goodsName}}</el-col>
            <el-col :span="3">{{item.batchNumber}}</el-col>
            <el-col :span="2">{{filterBizType(item.bizType)}}</el-col>
            <el-col :span="5">{{item.sourceOrgName}}</el-col>
            <el-col :span="5">{{item.directionOrgName}}</el-col>
            <el-col :span="1">{{item.count}}</el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="20"
                     :page-sizes="[20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :filterBizType="filterBizType" :formItem="form" :index="showIndex" :is="currentPart"
                 @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import SearchPart from './search';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import DataMixin from '@/mixins/dataMixin';
  import {bizTraces} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin, DataMixin],
    data() {
      return {};
    },
    watch: {
      filters: {
        handler: function (val) {
          let isEmpty = Object.keys(val).some(k => val[k]);
          if (!isEmpty) {
            this.dataList = [];
            return;
          }
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.dialogComponents = {
          1: showForm
        };
      },
      queryList(pageNo) {
        let http = bizTraces.queryByPlateNumber;
        this.queryUtil(http, pageNo);
      },
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.defaultPageRight.width = '1000px';
        this.form = item;
        this.showPart(1);
      }
    }
  };
</script>
