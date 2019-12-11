<style lang="scss" scoped>
  $leftWidth: 260px;
  .content-part {
    .content-left {
      width: $leftWidth;

      .list-style {
        padding: 10px 0 10px 0;
      }
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

  .min-row {
    .oms-row {
      margin-bottom: 10px;
    }
  }
</style>
<style lang="scss">
  .dialog-template-left-padding {
    &.content-part {
      .content-left {
        .list-style {
          padding: 10px 0 10px 0;
        }
      }
    }
  }
</style>
<template>
  <div>
    <dialog-template :pageSets="pageSets" @selectTab="selectTab" class="dialog-template-left-padding">
      <template slot="title">异常追溯码信息</template>
      <template slot="btn">
        <el-button plain @click="close">关闭</el-button>
      </template>
      <template slot="content">
        <div>
          <form-show-part :pageSetsItem="pageSets[0]" :currentTab="currentTab">
            <div slot="content" v-if="currentDetail.id">
              <oms-col :is-show="true" label="发生时间" :rowSpan="6" :value="currentDetail.happenTime | minute"/>
              <oms-col :is-show="true" label="上报时间" :rowSpan="6" :value="currentDetail.uploadTime | minute"/>
              <oms-col :is-show="true" label="上报人" :rowSpan="6" :value="currentDetail.creatorName"/>
              <oms-col :is-show="true" label="上报单位" :rowSpan="6" :value="currentDetail.uploadOrgName "/>
              <oms-col :is-show="true" label="上报作业状态" :rowSpan="6">
                <el-tag type="warning" v-show="currentDetail.status === '0'">解析中</el-tag>
                <el-tag type="success" v-show="currentDetail.status === '1'">已完成</el-tag>
                <el-tag type="danger" v-show="currentDetail.status === '2'">异常</el-tag>
              </oms-col>
              <oms-col :is-show="true" label="异常类型" :rowSpan="6" v-if="currentDetail.uploadType !== '0'">
                <dict dict-group="codeExceptionType" :dict-key="currentDetail.type"></dict>
              </oms-col>
              <oms-col :is-show="true" label="操作单位" :rowSpan="6" :value="currentDetail.operateOrgName"/>
            </div>
          </form-show-part>
          <div v-loading="loading0" v-if="pageSets[1]">
            <form-show-part :pageSetsItem="pageSets[1]" :currentTab="currentTab">
              <span slot="title-right" style="font-weight: 500;font-size: 16px">（{{orderAttachment.length}}）</span>
              <retrospect-file slot="content" :orderAttachment="orderAttachment"/>
            </form-show-part>
            <form-show-part :pageSetsItem="pageSets[2]" :currentTab="currentTab" v-if="errorList.length">
              <retrospect-error slot="content" :orderAttachment="orderAttachment"/>
            </form-show-part>
          </div>
          <div v-if="pageSets[3]">
            <form-show-part :pageSetsItem="pageSets[3]" :currentTab="currentTab">
              <retrospect-result slot="content" :codes="traceCodesResult"/>
            </form-show-part>
          </div>
          <div>
            <form-show-part :pageSetsItem="pageSets[4]" :currentTab="currentTab">
              <div slot="content">
                <div>
                  <div style="margin-bottom: 10px;overflow: hidden">
                  <span class="pull-right">
                   <span class="btn-search-toggle open">
                      <single-input v-model="filters.code" placeholder="请输入异常追溯码搜索" :showFocus="true"
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
        </div>
      </template>
    </dialog-template>
  </div>
</template>

<script>
  import {http} from '@/resources';
  import RetrospectFile from '../retrospect/retrospect-file';
  import RetrospectError from '../retrospect/retrospect-error-info';
  import RetrospectList from '../retrospect/retrospect-list';
  import RetrospectResult from '../retrospect/retrospect-result';
  import utils from '@/tools/utils';

  export default {
    components: {
      RetrospectFile,
      RetrospectError,
      RetrospectList,
      RetrospectResult
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
        traceCodes: [], // 追溯码列表
        traceCodesResult: [], // 统计信息
        filters: {
          code: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        currentDetail: {},
        packageType: utils.packageType,
        loading0: false,
        loading2: false
      };
    },
    mounted: function () {

    },
    computed: {
      pageSets() {
        const tabs = {
          0: {name: '基本信息', key: 0},
          1: {name: '异常追溯码文件', key: 1},
          2: {name: '错误信息', key: 2},
          4: {name: '解析明细', key: 4}
        };
        if (this.currentDetail.uploadType !== '0') {
          delete tabs['1'];
          tabs['3'] = {name: '统计信息', key: 3};
        }
        if (!this.errorList.length) delete tabs['2'];
        return tabs;
      },
      errorList() {
        return this.orderAttachment.filter(f => f.fileStatus > 1);
      }
    },
    watch: {
      detailId(val) {
        this.uploadStatus = '';
        this.orderAttachment = [];
        this.traceCodes = [];
        this.traceCodesResult = [];
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
        this.$http(`/code-exception/${this.detailId}/file`).then(res => {
          this.orderAttachment = res.data;
          this.loading0 = false;
        });
      },
      queryStatus() { // 查询解析状态
        http.get(`/code-exception/${this.detailId}`).then(res => {
          this.currentDetail = res.data;
          this.uploadStatus = res.data.status;

          if (this.uploadStatus !== '0' && !this.currentItem.happenTime) {
            this.$emit('refresh');
          }

          // 拿到请求状态后, 在查询其他信息
          this.queryAttachment();
          this.getTraceCodes(1);
          this.currentDetail.uploadType !== '0' && this.queryTraceCodesResult();
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
        http.get(`/code-exception/${this.detailId}/detail/code`, {params}).then(res => {
          this.traceCodes = res.data.list;
          if (this.traceCodes.length === this.pager.pageSize) {
            this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          }
          this.loading2 = false;
        });
      },
      queryTraceCodesResult() {
        this.$http.get(`/code-exception/${this.currentDetail.id}/trace-code/result`).then(res => {
          this.traceCodesResult = res.data.list;
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
