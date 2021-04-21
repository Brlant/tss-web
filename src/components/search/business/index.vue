<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group">
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="来源单位" :span="8">
                <el-select filterable placeholder="请输入名称搜来源单位" remote :remote-method="queryPermUpAllFactory"
                           :clearable="true" v-model="searchCondition.sourceOrgId"
                           popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in allOrgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ org.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="去向单位" :span="8">
                <el-select filterable placeholder="请输入名称搜去向单位" remote :remote-method="queryPermDownAllFactory"
                           :clearable="true" v-model="searchCondition.directionOrgId"
                           popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in downOrgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ org.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="8" label="业务单据号">
                <oms-input placeholder="请输入业务单据号" type="text" v-model.trim="searchCondition.objectNo"></oms-input>
              </oms-form-row>
            </el-col>

          </el-row>
          <el-row class="mt-10">
            <el-col :span="8">
              <oms-form-row :span="8" label="业务类型">
                <el-select filterable placeholder="请选择业务类型" v-model="searchCondition.bizType">
                  <el-option :key="item.key" :label="item.label" :value="item.value" v-for="item in bizTypes"/>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="业务时间">
                <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                                type="datetimerange" v-model="times1"/>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="8" label="">
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
          <el-col :span="4">业务单据号</el-col>
          <el-col :span="6">来源单位</el-col>
          <el-col :span="6">去向单位</el-col>
          <el-col :span="3">业务时间</el-col>
          <el-col :span="3">创建时间</el-col>
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
          <div :class="[{'active':currentOrderId===item.id}]" @click.prevent="showItem(item)"
               class="order-list-item order-list-item-bg"
               v-for="item in orderList">
            <el-row type="flex">
              <el-col :span="2">{{ filterBizType(item.bizType) }}</el-col>
              <el-col :span="4" class="R">{{ item.objectNo }}</el-col>
              <el-col :span="6">{{ item.sourceOrgName }}</el-col>
              <el-col :span="6">{{ item.directionOrgName }}</el-col>
              <el-col :span="3">{{ item.operateTime | minute }}</el-col>
              <el-col :span="3">{{ item.createTime | minute }}</el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="(orderList.length || pager.currentPage !== 1) && !loadingData">
      <el-cu-pagination :current-page="pager.currentPage" :page-size="20"
                        :page-sizes="[20,50,100]"
                        :total="pager.count" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next, jumper">
      </el-cu-pagination>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showDetail" @right-close="resetRightBox"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :filterBizType="filterBizType" :orderId="currentOrderId" @close="resetRightBox" @deleteItem="deleteItem()"></show-form>
    </page-right>
  </div>
</template>
<script>
import showForm from './form/show.form.vue';
import DataMixin from '@/mixins/dataMixin';
import methodsMixin from '@/mixins/methodsMixin';
import {http} from '@/resources';


export default {
  components: {showForm},
  mixins: [DataMixin, methodsMixin],
  data: function () {
    return {
      loadingData: false,
      showDetail: false,
      showSearch: true,
      orderList: [],
      filters: {
        objectOrgId: '',
        orgId: '',
        objectNo: '',
        bizType: '',
        sourceOrgId: '',
        directionOrgId: '',
        operateStartTime: '',
        operateEndTime: ''
      },
      searchCondition: {
        objectOrgId: '',
        orgId: '',
        objectNo: '',
        bizType: '',
        sourceOrgId: '',
        directionOrgId: '',
        operateStartTime: '',
        operateEndTime: ''
      },
      times1: '',
      activeStatus: 0,
      currentOrderId: '',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      }
    };
  },
  mounted() {
    this.queryPermDownAllFactory('all-code-biz-trace');
  },
  methods: {
    deleteItem(){
      this.resetRightBox();
      this.getOrderList(this.pager.currentPage);
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.operateStartTime = this.formatTimeAry(this.times1, 0);
      this.searchCondition.operateEndTime = this.formatTimeAry(this.times1, 1);
      Object.assign(this.filters, this.searchCondition);
      this.getOrderList(1);
    },
    resetSearchForm: function () {// 重置表单
      this.pager.count = 0;
      this.orderList = [];
      let temp = {
        objectOrgId: '',
        orgId: '',
        objectNo: '',
        bizType: '',
        sourceOrgId: '',
        directionOrgId: '',
        operateStartTime: '',
        operateEndTime: ''
      };
      this.times1 = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
    },
    resetRightBox: function () {
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
      if (this.$store.state.permissions.indexOf('query-all-supervise-unit') === -1 && !this.filters.sourceOrgId && !this.filters.directionOrgId) {
        return this.$notify.info('请选择来源单位或者去向单位');
      }
      this.pager.currentPage = pageNo;
      let params = {};
      this.loadingData = true;
      params = Object.assign({}, this.filters, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      });
      delete params.sourceOrgId;
      delete params.directionOrgId;

      if (this.filters.sourceOrgId) {
        params.objectOrgIdList = [this.filters.sourceOrgId];
      }

      if (this.filters.directionOrgId) {
        params.directionOrgIdList = [this.filters.directionOrgId];
      }

      this.$http.get('/code-regulatory/code-biz/pager', {params}).then(res => {
        this.orderList = res.data.list;
        this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.orderList.length === this.pager.pageSize ? 1 : 0);
        this.loadingData = false;
      });
    },
    showItem: function (order) {
      this.currentOrderId = order.id;
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
