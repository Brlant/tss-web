<style lang="scss" scoped>
  $leftWidth: 200px;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
    }
  }

  .el-button {
    padding: 9px 9px;
    font-size: 12px;
    border-radius: 4px;
  }

  .order-btn {
    margin-top: 50px;

    .el-button {
      width: 75px;
    }
  }

  .min-row {
    .oms-row {
      margin-bottom: 10px;
    }
  }
</style>

<template>
  <div>
    <dialog-template :pageSets="pageSets" @selectTab="selectTab">
      <template slot="title">追溯码信息</template>
      <template slot="btn">
        <el-button plain @click="close">关闭</el-button>
      </template>
      <template slot="content">
        <div>
          <form-show-part :pageSetsItem="pageSets[0]" :currentTab="currentTab">
            <div slot="content" v-if="currentItem.id">
              <oms-col :is-show="true" label="货品" :rowSpan="6" :value="currentItem.goodsName"/>
              <oms-col :is-show="true" label="规格" :rowSpan="6" :value="currentItem.specification"/>
              <oms-col :is-show="true" label="生产厂商" :rowSpan="6" :value="currentItem.factoryName"/>
              <oms-col :is-show="true" label="商品编号" :rowSpan="6" :value="currentItem.goodsTrackNo"/>
              <oms-col :is-show="true" label="批号" :rowSpan="6" class="R"
                       :value="currentItem.batchNumberList && currentItem.batchNumberList.join(',')"/>
              <oms-col :is-show="true" label="操作人" :rowSpan="6" :value="currentItem.createdName" v-if="!isLog"/>
              <!--<oms-col :is-show="true" label="上传时间" :rowSpan="6" :value="currentItem.createTime | time"/>-->
              <oms-col :is-show="true" label="上传单位" :rowSpan="6" :value="currentItem.orgName" v-if="isLog"/>
              <oms-col :is-show="true" label="操作人" :rowSpan="6" :value="currentItem.creatorName" v-if="isLog"/>
              <oms-col :is-show="true" :label="isLog ? '上传时间' : '操作时间'" :rowSpan="6"
                       :value="currentItem.createTime | time "/>
            </div>
          </form-show-part>
          <div v-loading="loading0">
            <form-show-part :pageSetsItem="pageSets[1]" :currentTab="currentTab">
              <span slot="title-right" style="font-weight: 500;font-size: 16px">（{{orderAttachment.length}}）</span>
              <retrospect-file slot="content" :orderAttachment="orderAttachment"/>
            </form-show-part>
            <form-show-part :pageSetsItem="pageSets[2]" :currentTab="currentTab" v-if="errorList.length">
              <retrospect-error slot="content" :orderAttachment="orderAttachment"/>
            </form-show-part>
          </div>
          <div v-loading="loading1">
            <form-show-part :pageSetsItem="pageSets[3]" :currentTab="currentTab">
              <retrospect-result slot="content" :codes="results"></retrospect-result>
            </form-show-part>
            <form-show-part :pageSetsItem="pageSets[4]" :currentTab="currentTab">
              <div slot="content">
                <div>
                  <div style="margin-bottom: 10px;overflow: hidden">
                  <span class="pull-right">
                   <span class="btn-search-toggle open">
                      <single-input v-model="filters.code" placeholder="请输入追溯码搜索" :showFocus="true"
                                    style="width: 200px"/>
                      <i class=" el-icon-t-search"></i>
                   </span>
                  </span>
                  </div>
                  <retrospect-list :traceCodes="traceCodes" :packageType="packageType"
                                   v-loading="loading2"></retrospect-list>
                  <div class="text-center" v-show="pager.count>pager.pageSize">
                    <el-cu-pagination
                      layout="prev, pager, next"
                      :total="pager.count" :pageSize="pager.pageSize" @current-change="getTraceCodes"
                      :current-page="pager.currentPage">
                    </el-cu-pagination>
                  </div>
                </div>
              </div>
            </form-show-part>
          </div>
          <form-show-part :pageSetsItem="pageSets[5]" :currentTab="currentTab">
            <share-data slot="content" :showDetail="showDetail" :current-item="currentItem"/>
          </form-show-part>
        </div>
      </template>
    </dialog-template>
  </div>
</template>

<script>
  import {http} from '@/resources';
  import RetrospectFile from '../retrospect/retrospect-file';
  import RetrospectError from '../retrospect/retrospect-error-info';
  import RetrospectResult from '../retrospect/retrospect-result';
  import RetrospectList from '../retrospect/retrospect-list';
  import shareData from './share-data';
  import utils from '@/tools/utils';

  export default {
    components: {
      RetrospectFile,
      RetrospectError,
      RetrospectResult,
      RetrospectList,
      shareData
    },
    name: 'showOrder',
    props: {
      detailId: {
        'type': String,
        'default': ''
      },
      currentItem: Object,
      isLog: Boolean,
      showDetail: Boolean
    },
    data: function () {
      return {
        currentTab: {},
        orderAttachment: [], // 文件列表
        uploadStatus: '', // 解析状态
        results: [], // 解析结果
        traceCodes: [], // 追溯码列表
        filters: {
          code: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        packageType: utils.packageType,
        loading0: false,
        loading1: false,
        loading2: false
      };
    },
    mounted: function () {

    },
    computed: {
      pageSets() {
        const tabs = {
          0: {name: '基本信息', key: 0},
          1: {name: '源文件', key: 1},
          2: {name: '错误信息', key: 2},
          3: {name: '解析概况', key: 3},
          4: {name: '解析明细', key: 4}
        };
        if (this.$store.state.permissions.includes('codes-file-bind-share-domain')) {
          tabs[5] = {name: '数据共享域名', key: 5};
        }
        if (!this.errorList.length) delete tabs['2'];
        return tabs;
      },
      errorList() {
        return this.orderAttachment.filter(f => f.fileStatus > 1);
      }
    },
    watch: {
      detailId() {
        this.uploadStatus = '';
        this.orderAttachment = [];
        this.results = [];
        this.traceCodes = [];
        this.filters.code = '';
        this.loading0 = true;
        this.loopQuery();
      },
      filters: {
        handler: function () {
          this.getTraceCodes(1);
        },
        deep: true
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('close');
      },
      queryAttachment() { // 查询追溯码文件
        if (!this.detailId) return;
        this.uploadStatus !== '0' && (this.loading0 = true);
        this.$http(`/code-upload/${this.detailId}/file`).then(res => {
          this.orderAttachment = res.data;
          this.loading0 = false;
        });
      },
      queryStatus() { // 查询解析状态
        http.get(`/code/${this.detailId}/upload-status`).then(res => {
          this.uploadStatus = res.data.uploadStatus;
          // 拿到请求状态后, 在查询其他信息
          this.queryAttachment();
          this.queryCodes();
          this.getTraceCodes(1);
        });
      },
      queryCodes() { // 查询解析结果
        if (!this.detailId) return;
        this.uploadStatus !== '0' && (this.loading1 = true);
        http.get(`/code/order-no/${this.detailId}/trace-code/result`).then(res => {
          this.results = res.data.list;
          this.loading1 = false;
        });
      },
      getTraceCodes(pageNo) {
        if (pageNo === 1) {
          this.pager.count = 0;
        }
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.uploadStatus !== '0' && (this.loading2 = true);
        http.get(`/code/order-no/${this.detailId}/trace-code`, {params}).then(res => {
          this.traceCodes = res.data.list;
          if (this.traceCodes.length === this.pager.pageSize) {
            this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          }
          this.loading2 = false;
        });
      },
      loopQuery() { // 循环查询
        if (this.uploadStatus && this.uploadStatus !== '0' || !this.showDetail) return;
        this.queryStatus();
        setTimeout(this.loopQuery, 2000);
      }
    }
  };
</script>
