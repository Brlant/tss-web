<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">上报时间</el-col>
        <el-col :span="3">追溯码</el-col>
        <el-col :span="4">货品</el-col>
        <el-col :span="4">生产厂商</el-col>
        <el-col :span="3">批号</el-col>
        <el-col :span="3">异常类型</el-col>
        <el-col :span="4">信息上传单位</el-col>
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
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="4"></el-col>
            <el-col :span="4">{{item.orgName}}</el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="4"></el-col>
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
      <component :formItem="form" :index="showIndex" :is="currentPart" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import SearchPart from './search';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {};
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
      this.init();
      this.queryList(1);
    },
    methods: {
      init() {
        this.dialogComponents = {
          1: showForm
        };
      },
      queryList(pageNo) {
        const http = () => this.$http.get('/order/org/relation');
        this.queryUtil(http, pageNo);
      },
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.defaultPageRight.width = '1000px';
        this.form = item;
        this.showPart(1);
        // this.$router.push(`/search/batch/${item.id}`);
      }
    }
  };
</script>
