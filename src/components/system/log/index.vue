<template>
  <div class="order-page">
    <search-part :operaType="operaType" @search="searchResult"></search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">操作类型</el-col>
        <el-col :span="5">发生时间</el-col>
        <el-col :span="4">操作人</el-col>
        <el-col :span="7">操作单位</el-col>
        <el-col :span="3">IP地址</el-col>
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
            <el-col :span="4">{{operaType[item.type].label}}</el-col>
            <el-col :span="5">{{item.createTime | time}}</el-col>
            <el-col :span="4">{{item.creatorName}}</el-col>
            <el-col :span="7">{{item.orgName}}</el-col>
            <el-col :span="3">{{item.ip}}</el-col>
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
  import {SystemLog} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {},
        operaType: {
          0: {label: '厂商上传解析追溯码', key: '0'},
          1: {label: '厂商上传业务信息', key: '1'},
          2: {label: '用户登录', key: '2'},
          3: {label: '上传异常事件', key: '3'}
        }
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
        const http = SystemLog.query;
        const params = this.queryUtil(http, pageNo);
      }
    }
  };
</script>
