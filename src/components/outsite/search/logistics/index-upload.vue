<template>
  <div class="order-page">
    <div class="container">
      <search-part @add="add" @search="searchResult"></search-part>
      <div class="order-list">
        <el-row class="order-list-header">
          <el-col :span="4">业务时间</el-col>
          <el-col :span="4">上传时间</el-col>
          <el-col :span="6">上传人</el-col>
          <el-col :span="7">上传单位</el-col>
          <el-col :span="3">状态</el-col>
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
          <div :class="[{'active':currentOrderId===item.id}]" @click.prevent="showItem(item)" class="order-list-item order-list-item-bg"
               v-for="item in orderList">
            <el-row>
              <el-col :span="4">{{item.operateTime | time}}</el-col>
              <el-col :span="4">{{item.createTime | time}}</el-col>
              <el-col :span="6">{{item.createdBy}}</el-col>
              <el-col :span="7">{{item.uploadOrgName}}</el-col>
              <el-col :span="3">
                <el-tag type="warning" v-show="item.status === '0'">解析中</el-tag>
                <el-tag type="success" v-show="item.status === '1'">正常</el-tag>
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
        layout="total, sizes, prev, pager, next">
      </el-pagination>
    </div>

    <page-right :css="{'width':'800px','padding':0}" :show="showItemRight" @right-close="resetRightBox">
      <add-form :defaultIndex="defaultIndex" @close="resetRightBox" @refresh="refresh"
                type="0"></add-form>
    </page-right>

    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail" @right-close="resetRightBox"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :filterBizType="filterBizType" :orderId="currentOrderId" @close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import showForm from './form/show.form.vue';
  import DataMixin from '@/mixins/dataMixin';
  import SearchPart from './search';
  import addForm from './form/addForm.vue';

  export default {
    components: {showForm, SearchPart, addForm},
    mixins: [DataMixin],
    data: function () {
      return {
        loadingData: true,
        showDetail: false,
        showSearch: true,
        showItemRight: false,
        orderList: [],
        filters: {},
        defaultIndex: 0,
        currentOrderId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        }
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
        this.filters = Object.assign({}, this.filters, search);
      },
      resetRightBox: function () {
        this.showDetail = false;
        this.showItemRight = false;
        this.defaultIndex = 0;
        this.$router.push('/retrospect/business/import/id');
      },
      getOrderList: function (pageNo) {
        if (pageNo === 1) {
          this.pager.count = 0;
        }
        this.pager.currentPage = pageNo;
        let param = {};
        this.loadingData = true;
        param = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        this.$http.get('/code-biz/file/pager', {params: param})
        // bizTraces.query(param)
          .then(res => {
            this.orderList = res.data.list;
            this.pager.count = res.data.count;
            this.loadingData = false;
          });
      },
      refresh(obj) {
        this.resetRightBox();
        if (obj && obj.id) {
          this.showItem(obj);
        }
        this.getOrderList(1);
      },
      add() {
        this.showItemRight = true;
        this.defaultIndex = 1;
      },
      showItem: function (order) {
        this.currentOrderId = order.id;
        this.showDetail = true;
        this.$router.push(`/retrospect/business/import/${order.id}`);
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
