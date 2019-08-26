<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="8">追溯码</el-col>
        <el-col :span="6">查询时间</el-col>
        <el-col :span="5">操作人</el-col>
        <el-col :span="5">IP地址</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length === 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[{'active':currentItemId===item.id}]" class="order-list-item no-pointer order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="8">{{item.traceCode}}</el-col>
            <el-col :span="6">{{item.accessTime | time}}</el-col>
            <el-col :span="5">{{item.userName}}</el-col>
            <el-col :span="5">{{item.accessIp}}</el-col>
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

  </div>
</template>
<script>
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {SingleLog} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {}
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.queryList(1);
    },
    methods: {
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      queryList(pageNo) {
        const http = SingleLog.query;
        const params = this.queryUtil(http, pageNo);
      }
    }
  };
</script>
