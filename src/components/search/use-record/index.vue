<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">追溯码</el-col>
        <el-col :span="8">货品</el-col>
        <el-col :span="4">批号</el-col>
        <el-col :span="4">使用/销售单位</el-col>
        <el-col :span="5">时间</el-col>
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
            <el-col :span="3" class="R">{{item.code}}</el-col>
            <el-col :span="8">
              {{item.goodsName}}
              <div class="f-grey">{{item.specification}}</div>
              <div class="f-grey">{{item.factoryName}}</div>
            </el-col>
            <el-col :span="4">
              批号：{{item.batchNumber}}
              <div class="f-grey is-flex" v-if="item.productionDate">
                <div>生产日期：</div>
                <ul class="text-part">
                  <li :key="index" v-for="(item, index) in formatDate(item.productionDate)">{{item}}</li>
                </ul>
              </div>
              <div class="f-grey is-flex" v-if="item.validityDate">
                <div>有效期至：</div>
                <ul class="text-part">
                  <li :key="index" v-for="(item, index) in formatDate(item.validityDate)">{{item}}</li>
                </ul>
              </div>
            </el-col>
            <el-col :span="4">{{item.orgName}}</el-col>
            <el-col :span="5">
              <div>使用/销售：{{item.time | minute}}</div>
              <div>记录：{{item.recordTime | minute}}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-cu-pagination :current-page="pager.currentPage" :page-size="20"
                        :page-sizes="[20,50,100]"
                        :total="pager.count" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next, jumper">
      </el-cu-pagination>
    </div>

  </div>
</template>
<script>
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';

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
      formatDate(val) {
        return val ? this.$moment(val).format('YYYY-MM-DD').split('') : '';
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      queryList(pageNo) {
        const http = params => this.$http.get('/code-regulatory/code-injection/pager', {params});
        this.queryUtil(http, pageNo, () => {
        }, () => {
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.dataList.length === this.pager.pageSize ? 1 : 0);
        });
      }
    }
  };
</script>
