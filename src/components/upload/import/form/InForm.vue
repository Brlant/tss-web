<style lang="scss" scoped>
  $leftWidth: 220px;
  .content-part {
    .content-left {
      width: 0;
    }

    .content-right {
      > h3 {
        left: 0;
      }

      left: 0;
    }
  }

  .el-checkbox--upload {
    position: absolute;
    left: 100px;
    top: 0;
    display: block;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <!--<div class="content-left">-->
      <!--<h2 class="clearfix right-title" style="font-size: 16px">上传追溯码</h2>-->
      <!--</div>-->
      <div class="content-right min-gutter">
        <h3>上传追溯码</h3>
        <div class="hide-content show-content">
          <el-form ref="form" :rules="rules" :model="form"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="货品" prop="goodsId">
              <el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable remote
                         :remote-method="queryManageGoods" @change="goodsChange"
                         :clearable="true" popperClass="custom-select" @click.native.once="queryManageGoods('')">
                <el-option :label="item.name" :value="item.goodsId" :key="item.id" v-for="item in manageGoods">
                  <manage-goods-option :optionItem="item"/>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0" v-show="form.goodsId">
              <oms-col label="规格" :value="currentGoods.specifications"/>
              <oms-col label="追溯码商品编号" :value="currentGoods.goodsTrackNo" :is-show="true"/>
            </el-form-item>
            <el-form-item label="批号" prop="batchNumberIdList">
              <el-select v-model="form.batchNumberIdList" filterable clearable remote multiple
                         :remoteMethod="queryGoodsBatchNumber" placeholder="请输入批号名称搜索批号">
                <el-option v-for="item in goodsBatchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber"/>
              </el-select>
            </el-form-item>
            <el-form-item label="上传模式">
              <el-checkbox v-model="isChecked">覆盖原有数据</el-checkbox>
            </el-form-item>
            <el-form-item label="上传追溯码">
              <oms-upload-relation uploadUrl="/qingstor/code/pre" deleteUrl="/code-upload/file"
                                   :fileList="fileList" :formData="{objectType:'traceCodeByOrg',
                                   type: isChecked ? '1' : undefined}" uploadTip="只能上传xml文件" accept="xml"
                                   @change="changeFiles" @isProgress="onUploadProgress"
                                   :clearUploadFiles="clearUploadFiles"
                                   @refreshCodes="setIsUploading(true)"></oms-upload-relation>
              <el-tag class="mt-10" v-show="uploading" type="warning">正在上传文件, 请勿关闭窗口</el-tag>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :disabled="doing"
                         v-show="form.attachmentIdList.length && !uploading">保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {http} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    props: ['defaultIndex'],
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          goodsId: '',
          batchNumberIdList: [],
          attachmentIdList: [],
          model: 0
        },
        rules: {
          goodsId: {required: true, message: '请选择货品', trigger: 'change'},
          batchNumberIdList: {required: true, type: 'array', message: '请选择批号', trigger: 'change'}
        },
        doing: false,
        fileList: [],
        isUploading: false,
        isChecked: false,
        uploadingFiles: null
      };
    },
    computed: {
      currentGoods() {
        return this.manageGoods.filter(f => f.goodsId === this.form.goodsId)[0] || {};
      },
      uploading() {
        return this.uploadingFiles && this.uploadingFiles.percentage < 100;
      }
    },
    watch: {
      defaultIndex(val) {
        this.$refs.form.resetFields();
        this.resetForm();
      }
    },
    methods: {
      setIsUploading(val) {
        this.isUploading = val;
      },
      onUploadProgress(file) {
        this.setIsUploading(false);
        this.uploadingFiles = file;
      },
      changeFiles(files) {
        this.form.attachmentIdList = files.filter(f => f.attachmentId).map(m => m.attachmentId);
      },
      clearUploadFiles() {
        this.uploadingFiles = null;
      },
      queryGoodsBatchNumber(query) {
        if (!this.form.goodsId) return;
        this.queryGoodsNumber('form.goodsId')(query);
      },
      goodsChange(val) {
        this.form.batchNumberIdList = [];
        this.goodsBatchNumberList = [];
        if (!this.form.goodsId) return;
        this.queryGoodsNumber('form.goodsId')('');
      },
      resetForm() {
        this.form = {
          goodsId: '',
          batchNumberIdList: [],
          attachmentIdList: [],
          model: 0
        };
        this.isChecked = false;
        this.fileList = [];
        this.isUploading = false;
        this.uploadingFiles = null;
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          if (!this.currentGoods.goodsTrackNo) {
            return this.$notify.info({
              message: '追溯码商品编号为空，请联系管理员'
            });
          }
          if (!this.form.attachmentIdList.length) {
            this.$notify.info({
              message: '请选择追溯码文件'
            });
            return;
          }
          // if (!this.isUploading) {
          //   this.$notify.info({
          //     message: '追溯码文件还没有上传完成，请等待'
          //   });
          //   return;
          // }
          this.form.type = 1;
          this.form.model = this.isChecked ? 1 : 0;
          this.doing = true;
          http.post('/code/org/parse/trace-code', this.form).then(res => {
            this.$emit('refresh', {id: res.data});
            this.resetForm();
            this.doing = false;
          }).catch(e => {
            this.$notify.error({
              duration: 2000,
              message: e.response && e.response.data && e.response.data.msg || '解析失败'
            });
            this.doing = false;
          });
        });
      }
    }
  };
</script>
