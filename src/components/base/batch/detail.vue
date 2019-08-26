<style lang="scss" scoped="">
  .qp-box {
    margin-bottom: 40px;
    padding: 20px;
    margin-left: 40px;
    box-shadow: 4px 4px 2px 0 #ddd;
  }

  .base-pic-list {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;

    .base-pic-item {
      border: 1px solid #eee;
      position: relative;
      cursor: pointer;
      width: 180px;
      margin: 5px;
      padding: 10px;
      font-size: 12px;

      img {
        width: 180px;
        height: 180px;
        display: block;
        background: #ccc;

      }
    }
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">批号信息</template>
    <template slot="btn">
      <el-button plain @click="close">关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loadingData">
        <oms-loading :loading="loadingData"></oms-loading>
      </div>
      <div v-else="!loadingData">
        <form-show-part :pageSetsItem="pageSets[0]" :currentTab="currentTab">
          <template slot="content">
            <el-row>
              <el-col :span="12">
                <oms-row label="批号" class="R">{{ batchNumber.batchNumber }}</oms-row>
                <oms-row label="货品编号">{{ batchNumber.goodsCode }}</oms-row>
                <oms-row label="货品名称">{{ batchNumber.goodsName }}</oms-row>
                <oms-row label="货品规格">{{ batchNumber.specification }}</oms-row>
                <oms-row label="批量/进口量">{{ batchNumber.batchReleaseCount }}</oms-row>
                <oms-row label="有效期">{{ batchNumber.expirationDate | date}}</oms-row>
              </el-col>
              <el-col :span="12">
                <oms-row label="生产日期">{{ batchNumber.productionDate | date }}</oms-row>
                <oms-row label="批签发日期">{{ batchNumber.batchReleaseDate | date }}</oms-row>
                <oms-row label="批签发号">{{ batchNumber.batchReleaseNumber }}</oms-row>
                <oms-row label="通关单号编码">{{ batchNumber.customsFormNumber }}</oms-row>
                <oms-row label="口岸检验报告编号">{{ batchNumber.portInspectionNumber }}</oms-row>
              </el-col>
            </el-row>
          </template>
        </form-show-part>
        <form-show-part :pageSetsItem="pageSets[1]" :currentTab="currentTab">
          <template slot="content">
            <el-row style="margin-bottom: 10px">
              <el-col :span="20">
                <el-row style="margin-bottom: 10px"
                        v-show="!isShow()">
                  <perm label="code-batch-number-attachment-upload">
                    <el-col :span="11" class="batch-number-upload">
                      <oms-upload-relation uploadName="选取药检报告附件" :formData="{objectId:id,objectType:'batch'}"
                                           @change="changeDrugControlReportFiles"
                                           :showFileList="isShowFileList"></oms-upload-relation>
                    </el-col>
                    <el-col :span="11" class="batch-number-upload">
                      <oms-upload-relation uploadName="选取批签发附件" :formData="{objectId:id,objectType:'batch'}"
                                           @change="changeBatchReleaseFiles"
                                           :showFileList="isShowFileList"></oms-upload-relation>
                    </el-col>
                  </perm>
                </el-row>
                <el-row style="margin-bottom: 10px" v-show="!isShow()">
                  <perm label="code-batch-number-attachment-upload">
                    <el-col :span="11" class="batch-number-upload">
                      <oms-upload-relation uploadName="选取进口注册证" :formData="{objectId:id,objectType:'batch'}"
                                           @change="changeImportCertificatesFiles"
                                           :showFileList="isShowFileList"></oms-upload-relation>
                    </el-col>
                    <el-col :span="11" class="batch-number-upload">
                      <oms-upload-relation uploadName="选取通关单" :formData="{objectId:id,objectType:'batch'}"
                                           @change="changeCustomsPassFiles"
                                           :showFileList="isShowFileList"></oms-upload-relation>
                    </el-col>
                  </perm>
                </el-row>
              </el-col>

              <el-col :span="2" v-show="!isShow()">
                <perm label="code-batch-number-attachment-upload">
                  <el-button type="primary" size="small" @click.prevent="onSubmit()">确认绑定</el-button>
                </perm>
              </el-col>
            </el-row>
            <div v-if="isShow()">
              <el-row>
                <el-col :span="12">
                  <div class="qp-box">
                    <el-row>
                      <h2>
                        药检报告
                        <div class="pull-right">
                          <perm label="code-batch-number-attachment-upload">
                            <oms-upload-relation uploadName="选取药检报告附件"
                                                 :formData="{objectId:id,objectType:'drugControlReport'}"
                                                 @change="changeDrugControlReportFiles"
                                                 :showFileList="false"></oms-upload-relation>
                          </perm>
                        </div>
                      </h2>
                      <div>
                        <div class="base-pic-list" v-if=" drugControlReportList.length>0">
                          <div class="base-pic-item"
                               v-if="Util.getType(drugControlReportList[0].attachmentStoragePath)">
                            <div @click="watchDrugControlReport(drugControlReportList[0])">
                              <compressed-img
                                :src="drugControlReportList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'"/>
                            </div>
                          </div>
                        </div>
                        <attachment-lists :attachmentIdList="drugControlReportIdList" :objectId="id"
                                          :objectType="'drugControlReport'"
                                          :permission="'code-batch-number-attachment-upload'"
                                          :deletePermission="'code-batch-number-attachment-upload'"
                                          @change="changeDrugControlReportFiles"></attachment-lists>
                      </div>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="qp-box">
                    <el-row>
                      <h2>
                        批签发
                        <div class="pull-right">
                          <perm label="code-batch-number-attachment-upload">
                            <oms-upload-relation uploadName="选取批签发附件"
                                                 :formData="{objectId:id,objectType:'batchRelease'}"
                                                 @change="changeBatchReleaseFiles"
                                                 :showFileList="false"></oms-upload-relation>
                          </perm>
                        </div>
                      </h2>
                      <div>
                        <div class="base-pic-list" v-if=" batchReleaseList.length>0">
                          <div class="base-pic-item" v-if="Util.getType(batchReleaseList[0].attachmentStoragePath)">
                            <div @click="watchBatchRelease(batchReleaseList[0])">
                              <compressed-img
                                :src="batchReleaseList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'"/>
                            </div>
                          </div>
                        </div>
                        <attachment-lists :attachmentIdList="batchReleaseIdList" :objectId="id"
                                          :objectType="'batchRelease'"
                                          :permission="'code-batch-number-attachment-upload'"
                                          :deletePermission="'code-batch-number-attachment-upload'"
                                          @change="changeBatchReleaseFiles"></attachment-lists>
                      </div>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="qp-box">
                    <el-row>
                      <h2>
                        进口注册证
                        <div class="pull-right">
                          <perm label="code-batch-number-attachment-upload">
                            <oms-upload-relation uploadName="选取进口注册证"
                                                 :formData="{objectId:id,objectType:'importCertificate'}"
                                                 @change="changeImportCertificatesFiles"
                                                 :showFileList="false"></oms-upload-relation>
                          </perm>
                        </div>
                      </h2>
                      <div>
                        <div class="base-pic-list" v-if=" importCertificateList.length>0">
                          <div class="base-pic-item"
                               v-if="Util.getType(importCertificateList[0].attachmentStoragePath)">
                            <div @click="watchImportCertificate(importCertificateList[0])">
                              <compressed-img
                                :src="importCertificateList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'"/>
                            </div>
                          </div>
                        </div>
                        <attachment-lists :attachmentIdList="importCertificateIdList" :objectId="id"
                                          :objectType="'importCertificate'"
                                          :permission="'code-batch-number-attachment-upload'"
                                          :deletePermission="'code-batch-number-attachment-upload'"
                                          @change="changeImportCertificatesFiles"></attachment-lists>
                      </div>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="qp-box">
                    <el-row>
                      <h2>
                        通关单
                        <div class="pull-right">
                          <perm label="code-batch-number-attachment-upload">
                            <oms-upload-relation uploadName="选取通关单"
                                                 :formData="{objectId:id,objectType:'customsPass'}"
                                                 @change="changeCustomsPassFiles"
                                                 :showFileList="false"></oms-upload-relation>
                          </perm>
                        </div>
                      </h2>
                      <div>
                        <div class="base-pic-list" v-if="customsPassList.length>0">
                          <div class="base-pic-item" v-if="Util.getType(customsPassList[0].attachmentStoragePath)">
                            <div @click="watchCustomsPass(customsPassList[0])">
                              <compressed-img
                                :src="customsPassList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'"/>
                            </div>
                          </div>
                        </div>
                        <attachment-lists :attachmentIdList="customsPassIdList" :objectId="id"
                                          :objectType="'customsPass'"
                                          :permission="'code-batch-number-attachment-upload'"
                                          :deletePermission="'code-batch-number-attachment-upload'"
                                          @change="changeCustomsPassFiles"></attachment-lists>
                      </div>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <!--<div style="margin:20px 0 20px;text-align: center" class="order-button" v-show="!batchNumber.fileFlag">-->
              <!--<perm label="oms-batchNumber-file-confirm">-->
              <!--<el-button type="primary" @click.prevent="confirmFile()">确认文件</el-button>-->
              <!--</perm>-->
              <!--</div>-->
            </div>
          </template>
        </form-show-part>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {http, OmsAttachment} from '../../../resources';
  import attachmentLists from '../../common/attachmentList.vue';
  import Util from '@/tools/utils';

  export default {
    components: {
      attachmentLists
    },
    props: ['id', 'showInfoPart'],
    data() {
      return {
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '关联文件', key: 1}
        ],
        currentTab: {},
        isShowFileList: true,
        loadingData: true,
        batchNumber: {},
        fileMap: [],
        drugControlReportIdList: {},
        batchReleaseIdList: {},
        importCertificateIdList: {},
        customsPassIdList: {},
        drugControlReportList: {},
        batchReleaseList: {},
        importCertificateList: {},
        customsPassList: {},
        drugControlReport: {
          id: '',
          drugControlReportIds: []
        },
        batchReleases: {
          id: '',
          batchReleasesIds: []
        },
        importCertificates: {
          id: '',
          importCertificatesIds: []
        },
        customsPass: {
          id: '',
          customsPassIds: []
        },
        pojoLogList: [],
        updateLogForm: {},
        Util
      };
    },
    watch: {
      showInfoPart(val) {
        if (!val) return;
        let {id} = this;
        // 清空数据
        this.batchNumber = {};
        this.drugControlReportList = {};
        this.batchReleaseList = {};
        this.importCertificateList = {};
        this.customsPassList = {};
        this.pojoLogList = {};
        this.queryStoreDetails();
        this.getDrugControlReportList(id, 'drugControlReport');
        this.getBatchReleaseList(id, 'batchRelease');
        this.getImportCertificateList(id, 'importCertificate');
        this.getCustomsPassList(id, 'customsPass');
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      isShow() {
        return this.drugControlReportList.length || this.batchReleaseList.length ||
          this.importCertificateList.length || this.importCertificateList.length;
      },
      changeDrugControlReportFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.drugControlReport = Object.assign({}, {
          id: this.id,
          drugControlReportIds: ids
        });
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.id, 'drugControlReport').then(res => {
          this.drugControlReportIdList = res.data;
          this.drugControlReportList = res.data;
        });
      },
      changeBatchReleaseFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.batchReleases = Object.assign({}, {
          id: this.id,
          batchReleasesIds: ids
        });
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.id, 'batchRelease').then(res => {
          this.batchReleaseIdList = res.data;
          this.batchReleaseList = res.data;
        });
      },
      changeImportCertificatesFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.importCertificates = Object.assign({}, {
          id: this.id,
          importCertificatesIds: ids
        });
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.id, 'importCertificate').then(res => {
          this.importCertificateIdList = res.data;
          this.importCertificateList = res.data;
        });
      },
      changeCustomsPassFiles: function (fileList) {// 上传附件时，获取附加id
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.customsPass = Object.assign({}, {
          id: this.id,
          customsPassIds: ids
        });
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.id, 'customsPass').then(res => {
          this.customsPassIdList = res.data;
          this.customsPassList = res.data;
        });
      },
      getDrugControlReportList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.drugControlReportList = res.data;
        });
      },
      getBatchReleaseList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.batchReleaseList = res.data;
        });
      },
      getImportCertificateList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.importCertificateList = res.data;
        });
      },
      getCustomsPassList: function (objectId, objectType) {
        if (!objectId) return;
        OmsAttachment.queryOneAttachmentList(objectId, objectType).then(res => {
          this.customsPassList = res.data;
        });
      },
      watchDrugControlReport(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.drugControlReportList,
            objectId: this.id,
            objectType: 'drugControlReport'
          });
        }
      },
      watchBatchRelease(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.batchReleaseList,
            objectId: this.id,
            objectType: 'batchRelease'
          });
        }
      },
      watchImportCertificate(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.importCertificateList,
            objectId: this.id,
            objectType: 'importCertificate'
          });
        }
      },
      watchCustomsPass(item) {
        if (item) {
          this.$store.commit('changeAttachment', {
            currentId: item.attachmentId,
            attachmentList: this.customsPassList,
            objectId: this.id,
            objectType: 'customsPass'
          });
        }
      },
      queryStoreDetails() {
        this.loadingData = true;
        http.get(`/dhs-batch-number/${this.id}`).then(res => {
          this.batchNumber = res.data;
          this.fileMap = res.data.map;
          this.loadingData = false;
        });
      },
      confirmFile: function () {
        this.$confirm('确认批号关联文件信息无误吗', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/dhs-batch-number/${this.id}/audit`).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功批号关联文件信息'
            });
            this.$emit('change', this.id);
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '批号关联文件信息确认失败'
            });
          });
        }).catch(() => {
        });
      },
      onSubmit: function () {
        let batchReleases = [];
        let drugControlReports = [];
        let importCertificates = [];
        let customsPass = [];
        if (this.id === this.drugControlReport.id) {
          drugControlReports = this.drugControlReport.drugControlReportIds;
        }
        if (this.id === this.batchReleases.id) {
          batchReleases = this.batchReleases.batchReleasesIds;
        }
        if (this.id === this.importCertificates.id) {
          importCertificates = this.importCertificates.importCertificatesIds;
        }
        if (this.id === this.customsPass.id) {
          customsPass = this.customsPass.customsPassIds;
        }
        if (!batchReleases.length && !drugControlReports.length && !importCertificates.length && !customsPass.length) {
          this.$notify.info({
            duration: 2000,
            message: '请选择附件'
          });
          return;
        }
        let obj = {
          batchReleases: batchReleases,
          drugControlReports: drugControlReports,
          importCertificates: importCertificates,
          customsPass: customsPass
        };
        http.put('/dhs-batch-number/' + this.id + '/attachment', obj).then(() => {
          this.isShowFileList = false;
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功上传附件'
          });
          this.queryStoreDetails();
          this.getDrugControlReportList(this.id, 'drugControlReport');
          this.getBatchReleaseList(this.id, 'batchRelease');
          this.getImportCertificateList(this.id, 'importCertificate');
          this.getCustomsPassList(this.id, 'customsPass');
          this.drugControlReport = {
            id: '',
            drugControlReportIds: []
          };
          this.batchReleases = {
            id: '',
            batchReleasesIds: []
          };
        });
      }
    }
  };
</script>
