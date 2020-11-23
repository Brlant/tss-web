<style lang="scss" scoped>
  @import "../../../../assets/scss/mixins";

  $leftWidth: 200px;

  .el-form .el-select {
    display: block;
  }

  .table-product-list {
    font-size: 12px;

    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
  }

  .min-row {
    .oms-row {
      margin-bottom: 10px;
    }
  }

  .border-bottom {
    border-bottom: 1px solid #f1f1f1;
  }

  .add-btn {
    margin-left: 10px;
    cursor: pointer;

    :hover {
      color: #ff3300;
    }
  }
</style>

<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">业务信息</template>
    <template slot="btn">
<!--      <perm label="code-biz-log-push">-->
<!--        <div class="mb-15">-->
<!--          <el-button type="primary" @click="pushData" :loading="pushing">推送数据</el-button>-->
<!--        </div>-->
<!--      </perm>-->
      <el-button plain @click="close">关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loadingData">
        <oms-loading :loading="loadingData"></oms-loading>
      </div>
      <div v-else-if="!currentOrder.id" class="empty-info">暂无数据</div>
      <div v-else>
        <form-show-part :pageSetsItem="getPageSizeItem(0)" :currentTab="currentTab">
          <div slot="content">
            <el-row style="margin-bottom:0">
              <el-col :span="12">
                <oms-row label="业务单据号" :span="6">{{ currentOrder.objectNo }}</oms-row>
                <oms-row label="业务类型" :span="6"> {{filterBizType(currentOrder.bizType)}}</oms-row>
                <oms-row label="来源单位" :span="6">{{currentOrder.sourceOrgName}}</oms-row>
                <oms-row label='物流方式' :span="6">{{currentOrder.transportationMeans}}</oms-row>
                <oms-row label='运输条件' :span="6">{{currentOrder.logisticsMode}}</oms-row>
                <oms-row label='签收时间' :span="6" v-show="currentOrder.handoverTime">{{currentOrder.handoverTime | time}}
                </oms-row>
                <oms-row label='签收人' :span="6" v-show="currentOrder.handoverPerson">{{currentOrder.handoverPerson}}
                </oms-row>
                <oms-row label='签收单位' :span="6" v-show="currentOrder.handoverOrg">{{currentOrder.handoverOrg}}</oms-row>
                <oms-row label='上传人' :span="6" v-show="currentOrder.createdBy">{{currentOrder.createdBy}}</oms-row>
                <oms-row label='上传单位' :span="6" v-show="currentOrder.uploadOrgName">{{currentOrder.uploadOrgName}}
                </oms-row>
                <oms-row label="上传时间" :span="6" v-show="currentOrder.createTime">{{currentOrder.createTime | time}}
                </oms-row>
              </el-col>
              <el-col :span="12">
                <oms-row label="作业号" :span="7"> {{currentOrder.taskId}}</oms-row>
                <oms-row label="去向单位" :span="7">
                  {{currentOrder.directionOrgName }}
                </oms-row>
                <oms-row label="业务时间" :span="7">{{currentOrder.operateTime | time}}</oms-row>
                <oms-row label="创建时间" :span="7">{{currentOrder.createTime | time}}</oms-row>
                <oms-row label='温度是否合格' :span="7" v-show="typeof currentOrder.temperatureFlag === 'boolean'">
                  <span v-show="currentOrder.temperatureFlag">合格</span>
                  <span v-show="!currentOrder.temperatureFlag">不合格</span>
                </oms-row>
                <oms-row label='操作人' :span="7" v-show="currentOrder.createdBy">{{currentOrder.createdBy}}</oms-row>
                <oms-row label='操作单位' :span="7">{{currentOrder.systemOrg}}</oms-row>

                <oms-row :is-show="true" label="状态" :span="7">
                  <el-tag type="warning" v-show="currentOrder.status === '0'">解析中</el-tag>
                  <el-tag type="success" v-show="currentOrder.status === '1'">正常</el-tag>
                  <el-tag type="danger" v-show="currentOrder.status === '2'">异常</el-tag>
                </oms-row>
              </el-col>
            </el-row>
            <el-table :data="currentOrder.detailList" style="width: 100%" class="mt-10 header-list">
              <el-table-column prop="goodsName" label="货品名称" min-width="200"/>
              <el-table-column prop="specification" label="规格" min-width="120"/>
              <el-table-column prop="batchNumber" label="批号"/>
              <el-table-column prop="count" label="数量" min-width="80"/>
            </el-table>
          </div>
        </form-show-part>
        <div v-if="isUpload" v-loading="loading0">
          <form-show-part :pageSetsItem="getPageSizeItem(3)" :currentTab="currentTab">
            <span slot="title-right" style="font-weight: 500;font-size: 16px">（{{orderAttachment.length}}）</span>
            <retrospect-file slot="content" :orderAttachment="orderAttachment"/>
          </form-show-part>
          <form-show-part :pageSetsItem="getPageSizeItem(4)" :currentTab="currentTab" v-if="errorList.length">
            <retrospect-error slot="content" :orderAttachment="orderAttachment"/>
          </form-show-part>
        </div>
        <form-show-part :pageSetsItem="getPageSizeItem(2)" :currentTab="currentTab">
<!--          <perm label="code-biz-trace-insert-code" slot="title-right">-->
<!--            <span class="add-btn" @click="showAddCodeForm = true">-->
<!--              <i class="el-icon-circle-plus-outline">添加追溯码信息</i>-->
<!--            </span>-->
<!--          </perm>-->
          <div slot="content">
<!--            <form v-show="showAddCodeForm">-->
<!--              <el-form :model="form" ref="numberValidateForm" label-width="100px" inline>-->
<!--                <el-form-item label="追溯码" prop="code" :rules="[{ required: true, message: '追溯码不能为空'}]">-->
<!--                  <el-input v-model.trim="form.code" autocomplete="off" style="width: 300px"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                  <el-button type="primary" :disabled="doing" @click="submitForm('numberValidateForm')">保存</el-button>-->
<!--                  <el-button @click="showAddCodeForm = false">取消</el-button>-->
<!--                </el-form-item>-->
<!--              </el-form>-->
<!--            </form>-->
            <relevance-code :currentOrder="currentOrder" :index="index" ref="relevanceCodePart" showFormSearch
                            :httpRequest="bizTraces.queryTraceCodes" operate></relevance-code>
          </div>
        </form-show-part>
      </div>
    </template>
  </dialog-template>
</template>

<script>
  import {bizTraces} from '@/resources';
  import relevanceCode from '@/components/common/order/relevance.code';
  import RetrospectError from '@/components/upload/exception-code/retrospect/retrospect-error-info.vue';
  import RetrospectFile from '@/components/upload/exception-code/retrospect/retrospect-file.vue'; //

  export default {
    components: {relevanceCode, RetrospectFile, RetrospectError},
    name: 'showOrder',
    props: {
      orderId: {
        'type': String,
        'default': ''
      },
      filterBizType: Function
    },
    data: function () {
      return {
        loadingData: false,
        loading0: false,
        currentOrder: {
          detailList: []
        },
        index: 0,
        currentTab: {},
        orderAttachment: [],
        bizTraces,
        showAddCodeForm: false,
        form: {
          code: ''
        },
        doing: false,
        pushing: false
      };
    },
    computed: {
      pageSets() {
        if (!this.isUpload) {
          return [
            {name: '基本信息', key: 0},
            {name: '追溯码信息', key: 2}
          ];
        } else {
          let tabs = [
            {name: '基本信息', key: 0},
            {name: '业务追溯文件', key: 3},
            {name: '追溯码信息', key: 2}
          ];
          if (this.errorList.length) {
            tabs.splice(2, 0, {name: '错误信息', key: 4});
          }
          return tabs;
        }
      },
      isUpload() {
        return this.$route.meta.isUpload;
      },
      errorList() {
        return this.orderAttachment.filter(f => f.fileStatus > 1);
      }
    },
    watch: {
      orderId: function () {
        this.index = -1;
        this.currentOrder = {
          detailList: []
        };
        this.orderAttachment = [];
        this.showAddCodeForm = false;
        this.form.code = '';
        this.isUpload && this.loopQuery() || this.getOrderInfo();
      }
    },
    methods: {
      pushData() {
        if (this.pushing) return;
        this.pushing = true;
        let params = {
          bizLogId: this.currentOrder.id
        };
        this.$http.get('/code-biz/push', {params}).then(res => {
          this.$notify.success({message: '推送完成'});
          this.pushing = false;
        }).catch(e => {
          this.pushing = false;
          this.$notify.error({
            title: '推送失败',
            message: e.response && e.response.data && e.response.data.msg
          });
        });
      },
      getPageSizeItem(key) {
        return this.pageSets.filter(f => f.key === key)[0];
      },
      getOrderInfo: function () {
        if (!this.orderId) return;
        this.loadingData = true;
        bizTraces.get(this.orderId).then(res => {
          this.currentOrder = res.data;
          this.loadingData = false;
          // 拿到请求状态后, 在查询其他信息
          this.queryAttachment();
          this.index = -1;
          this.$nextTick(() => {
            this.index = 2;
          });
        });
      },
      queryAttachment() {
        if (!this.orderId) return;
        this.loading0 = true;
        this.$http(`/code-biz/${this.orderId}/file`).then(res => {
          this.orderAttachment = res.data;
          this.loading0 = false;
        });
      },
      loopQuery() { // 循环查询
        if (this.currentOrder.status && this.currentOrder.status !== '0') return;
        this.getOrderInfo();
        setTimeout(this.loopQuery, 2000);
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('close');
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) return;
          this.doing = true;
          this.$http.post('/code-biz/manually/log', {
            bizLogId: this.currentOrder.id,
            traceCode: this.form.code
          }).then(res => {
            this.$notify.success({message: '添加成功'});
            this.doing = false;
            this.$refs[formName].resetFields();
            this.$refs.relevanceCodePart.getTraceCodes(1);
          }).catch(e => {
            this.doing = false;
            this.$notify.error({
              title: '添加失败',
              message: e.response && e.response.data && e.response.data.msg
            });
          });
        });
      }
    }
  };
</script>
