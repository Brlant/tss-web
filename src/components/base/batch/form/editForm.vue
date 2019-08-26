<style lang="scss" scoped="">

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

  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .el-form .el-select {
    display: block;
  }

  .tr-bg {
    background: #eeeeee;
  }

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
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">{{actionType==='edit' ? '编辑' : '添加'}}批号信息</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="index = item.key"
              :class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:30px;position:absolute;bottom:50px;left:0;right:0;">
            <el-button type="primary" @click="submitForm()" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3></h3>
        <div class="hide-content" :class="{'show-content' : index==0}">
          <el-form ref="batchForm" :rules="rules" :model="form" label-width="140px" class="min-gutter"
                   @submit.prevent="submitForm()" onsubmit="return false" style="padding-right: 20px">
            <el-form-item label="货品" prop="goodsId" v-if="actionType==='add'">
              <el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable remote
                         :remote-method="queryManageGoods"
                         :clearable="true" popperClass="custom-select" @click.native.once="queryManageGoods('')">
                <el-option :label="item.name" :value="item.goodsId" :key="item.id" v-for="item in manageGoods">
                  <manage-goods-option :optionItem="item"/>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂商" v-if="actionType==='add' && form.goodsId">
              {{factoryName}}
            </el-form-item>
            <el-form-item label="批号" prop="batchNumber">
              <oms-input placeholder="请输入" v-model.trim="form.batchNumber"></oms-input>
            </el-form-item>
            <el-form-item label="生产日期 " prop="productionDate">
              <el-date-picker
                v-model="form.productionDate"
                placeholder="请选择生产日期" format="yyyy-MM-dd"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期 " prop="expirationDate">
              <el-date-picker
                v-model="form.expirationDate"
                placeholder="请选择有效期" format="yyyy-MM-dd"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="批量/进口量">
              <oms-input type="number" placeholder="请输入批量/进口量" v-model.number="form.batchReleaseCount"></oms-input>
            </el-form-item>
            <el-form-item label="批签发日期">
              <el-date-picker
                v-model="form.batchReleaseDate"
                placeholder="请选择批签发日期" format="yyyy-MM-dd"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="批签发号">
              <oms-input placeholder="请输入批签发号" v-model="form.batchReleaseNumber"></oms-input>
            </el-form-item>
            <el-form-item label="通关单号编码">
              <oms-input placeholder="请输入通关单号编码" v-model="form.customsFormNumber"></oms-input>
            </el-form-item>
            <el-form-item label="口岸检验报告编号">
              <oms-input placeholder="请输入口岸检验报告编号" v-model="form.portInspectionNumber"></oms-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="index=1">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" style="padding: 0" :class="{'show-content' : index==1}">
          <el-row>
            <el-col :span="12">
              <div class="qp-box">
                <el-row>
                  <h2>
                    药检报告
                    <div class="pull-right">
                      <oms-upload-relation uploadName="选取药检报告附件"
                                           :formData="{objectId:form.id,objectType:'drugControlReport'}"
                                           @change="changeDrugControlReportFiles"
                                           :showFileList="false"></oms-upload-relation>
                    </div>
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if=" drugControlReportList.length>0">
                      <div class="base-pic-item" v-if="Util.getType(drugControlReportList[0].attachmentStoragePath)">
                        <div @click="watchDrugControlReport(drugControlReportList)">
                          <img
                            :src="drugControlReportList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="drugControlReportList" :objectId="form.id"
                                      :objectType="'drugControlReport'"
                                      :permission="'show'"
                                      :deletePermission="'show'"
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
                      <oms-upload-relation uploadName="选取批签发附件"
                                           :formData="{objectId:form.id,objectType:'batchRelease'}"
                                           @change="changeBatchReleaseFiles"
                                           :showFileList="false"></oms-upload-relation>
                    </div>
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if=" batchReleaseList.length>0">
                      <div class="base-pic-item" v-if="Util.getType(batchReleaseList[0].attachmentStoragePath)">
                        <div @click="watchBatchRelease(batchReleaseList)">
                          <img :src="batchReleaseList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="batchReleaseList" :objectId="form.id"
                                      :objectType="'batchRelease'"
                                      :permission="'show'"
                                      :deletePermission="'show'"
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
                      <oms-upload-relation uploadName="选取进口注册证"
                                           :formData="{objectId:form.id,objectType:'importCertificate'}"
                                           @change="changeImportCertificatesFiles"
                                           :showFileList="false"></oms-upload-relation>
                    </div>
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if=" importCertificateList.length>0">
                      <div class="base-pic-item" v-if="Util.getType(importCertificateList[0].attachmentStoragePath)">
                        <div @click="watchImportCertificate(importCertificateList)">
                          <img
                            :src="importCertificateList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="importCertificateList" :objectId="form.id"
                                      :objectType="'importCertificate'"
                                      :permission="'show'"
                                      :deletePermission="'show'"
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
                      <oms-upload-relation uploadName="选取通关单"
                                           :formData="{objectId:form.id,objectType:'customsPass'}"
                                           @change="changeCustomsPassFiles"
                                           :showFileList="false"></oms-upload-relation>
                    </div>
                  </h2>
                  <div>
                    <div class="base-pic-list" v-if="customsPassList.length>0">
                      <div class="base-pic-item" v-if="Util.getType(customsPassList[0].attachmentStoragePath)">
                        <div @click="watchCustomsPass(customsPassList)">
                          <img :src="customsPassList[0].attachmentStoragePath+'?image&action=resize:w_180,h_180,m_2'">
                        </div>
                      </div>
                    </div>
                    <attachment-lists :attachmentIdList="customsPassList" :objectId="form.id"
                                      :objectType="'customsPass'"
                                      :permission="'show'"
                                      :deletePermission="'show'"
                                      @change="changeCustomsPassFiles"></attachment-lists>
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {http, OmsAttachment} from '../../../../resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import uuidv1 from 'uuid/v1';
  import attachmentLists from '@/components/common/attachmentList.vue';
  import Util from '@/tools/utils';

  export default {
    props: {
      currentItem: {},
      actionType: String
    },
    components: {
      attachmentLists
    },
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          'batchNumber': '',
          'batchReleaseCount': '',
          'batchReleaseDate': '',
          'batchReleaseNumber': '',
          'customsFormNumber': '',
          'portInspectionNumber': '',
          'createTime': '',
          'createdBy': '',
          'expirationDate': '',
          'goodsId': '',
          'goodsName': '',
          'id': '',
          'orgId': '',
          'orgName': '',
          'productionDate': '',
          'specification': ''
        },
        rules: {
          batchNumber: [
            {required: true, message: '请输入批号', trigger: 'blur'}
          ],
          goodsId: [
            {required: true, message: '请选择货品', trigger: 'blur'}
          ],
          productionDate: [
            {required: true, message: '请选择生产日期', trigger: 'change'}
          ],
          expirationDate: [
            {required: true, message: '请输入有效期', trigger: 'change'}
          ]
        },
        productListSet: [
          {name: '基本信息', key: 0},
          {name: '批号文件', key: 1}
        ],
        index: 0,
        doing: false,
        isShowFileList: true,
        drugControlReportList: [],
        batchReleaseList: [],
        importCertificateList: [],
        customsPassList: [],
        Util
      };
    },
    watch: {
      currentItem(val) {
        this.form = Object.assign({}, val);
        if (this.actionType === 'add') {
          this.form.id = uuidv1().substring(0, 32);
        }
      }
    },
    computed: {
      factoryName() {
        let goods = this.manageGoods.filter(f => f.goodsId === this.form.goodsId)[0];
        if (!goods) return '';
        return goods.factoryName;
      }
    },
    methods: {
      getTitle() {
        let title = '';
        if (this.actionType === 'edit') {
          title = '编辑';
        } else {
          title = '新增';
        }
        return title;
      },
      changeTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      changeDrugControlReportFiles: function (fileList) {// 上传附件时，获取附加id
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'drugControlReport').then(res => {
          this.drugControlReportList = res.data;
        });
      },
      changeBatchReleaseFiles: function (fileList) {// 上传附件时，获取附加id
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'batchRelease').then(res => {
          this.batchReleaseList = res.data;
        });
      },
      changeImportCertificatesFiles: function (fileList) {// 上传附件时，获取附加id
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'importCertificate').then(res => {
          this.importCertificateList = res.data;
        });
      },
      changeCustomsPassFiles: function (fileList) {// 上传附件时，获取附加id
        this.isShowFileList = true;
        OmsAttachment.queryOneAttachmentList(this.form.id, 'customsPass').then(res => {
          this.customsPassList = res.data;
        });
      },
      watchDrugControlReport(item) {
        if (item.length > 0) {
          this.$store.commit('changeAttachment', {
            currentId: item[0].attachmentId,
            attachmentList: item,
            objectId: this.currentOrderId,
            objectType: 'drugControlReport'
          });
        }
      },
      watchBatchRelease(item) {
        if (item.length > 0) {
          this.$store.commit('changeAttachment', {
            currentId: item[0].attachmentId,
            attachmentList: item,
            objectId: this.currentOrderId,
            objectType: 'batchRelease'
          });
        }
      },
      watchImportCertificate(item) {
        if (item.length > 0) {
          this.$store.commit('changeAttachment', {
            currentId: item[0].attachmentId,
            attachmentList: item,
            objectId: this.currentOrderId,
            objectType: 'importCertificate'
          });
        }
      },
      watchCustomsPass(item) {
        if (item.length > 0) {
          this.$store.commit('changeAttachment', {
            currentId: item[0].attachmentId,
            attachmentList: item,
            objectId: this.currentOrderId,
            objectType: 'customsPass'
          });
        }
      },
      resetForm() {
        this.form = {
          'batchNumber': '',
          'batchReleaseCount': '',
          'batchReleaseDate': '',
          'batchReleaseNumber': '',
          'customsFormNumber': '',
          'portInspectionNumber': '',
          'createTime': '',
          'createdBy': '',
          'expirationDate': '',
          'goodsId': '',
          'goodsName': '',
          'id': '',
          'orgId': '',
          'orgName': '',
          'productionDate': '',
          'specification': ''
        };
        this.drugControlReportList = [];
        this.batchReleaseList = [];
        this.importCertificateList = [];
        this.customsPassList = [];
      },
      submitForm() {
        this.$refs['batchForm'].validate(valid => {
          if (!valid) {
            this.index = 0;
            return;
          }
          this.doing = true;
          if (this.actionType === 'edit') {
            http.put('/dhs-batch-number/' + this.form.id, this.form).then(res => {
              this.$notify.success({
                message: '修改批号成功'
              });
              this.doing = false;
              this.$emit('change', this.id);
              this.$emit('close');
            }).catch(err => {
              this.doing = false;
              this.$notify.error({
                message: err.response.data && err.response.data.msg || '修改批号失败'
              });
            });
          } else {
            http.post('/dhs-batch-number', this.form).then(res => {
              this.$notify.success({
                message: '新增批号成功'
              });
              this.doing = false;
              this.$emit('change', res.data);
              this.$emit('close');
              this.resetForm();
            }).catch(err => {
              this.doing = false;
              this.$notify.error({
                message: err.response.data && err.response.data.msg || '新增批号失败'
              });
            });
          }
        });
      }
    }
  };
</script>
