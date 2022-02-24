<template>
  <div class="order-page">
    <search-part @addBatchNumber="addBatchNumber" @search="searchResult" ref="searchPart"></search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="7">货品</el-col>
        <el-col :span="4">批号</el-col>
        <el-col :span="4">业务时间</el-col>
        <el-col :span="3">创建人</el-col>
        <el-col :span="4">查询完成时间</el-col>
        <el-col :span="2">状态</el-col>
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
            <el-col :span="7">{{item.goodsName}}</el-col>
            <el-col :span="4">{{item.batchNumber}}</el-col>
            <el-col :span="4">
              <span v-show="item.startTime">{{item.startTime | date}}~{{item.endTime | date}}</span>
              <span v-show="!item.startTime">无限制</span>
            </el-col>
            <el-col :span="3">{{item.creatorName}}</el-col>
            <el-col :span="4">
              <span v-show="item.completeTime">{{item.completeTime | time}}</span>
            </el-col>
            <el-col :span="2">
              <el-tag type="primary" v-show="item.status==='0'">查询中...</el-tag>
              <el-tag type="success" v-show="item.status==='1'">已完成</el-tag>
            </el-col>
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
      <component :defaultIndex="showIndex" :is="currentPart"
                 @refresh="refresh"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from '../search';
  import CommonMixin from '@/mixins/commonMixin';
  import DataMixin from '@/mixins/dataMixin';
  import {bizTraces} from '@/resources';
  import AddForm from '../form/add-form';
  import updateMixin from "../../mixins/updateMixin";
  export default {
    components: {
      SearchPart, AddForm
    },
    mixins: [CommonMixin, DataMixin, updateMixin],
    data() {
      return {};
    },
    watch: {
      filters: {
        handler: function (val) {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.defaultPageRight={
        ...this.defaultPageRight,
        top: 0
      }
      this.init();
      this.queryList(1);
    },
    methods: {
      init() {
        this.dialogComponents = {
          1: AddForm
        };
      },
      queryList(pageNo) {
        let http = bizTraces.queryPlateNumberTask;
        this.queryUtil(http, pageNo);
      },
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$router.push(this.$route.path + '/' + item.id);
      },
      refresh(form) {
        this.resetRightBox();
        this.$router.push(this.$route.path + '/' + form.id);
      },
      addBatchNumber() {
        this.showPart(1);
      }
    }
  };
</script>
<style lang="scss">
@import "~@/assets/scss/outCommon";
</style>
