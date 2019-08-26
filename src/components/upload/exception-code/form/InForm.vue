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

  .waring-tag {
    position: absolute;
    top: 0;
    left: 70px;
    padding-left: 10px;
    margin-bottom: 5px;
    /*color: #d1566d;*/
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3>上传异常追溯码文件</h3>
        <div class="hide-content show-content">
          <el-form ref="form" :rules="rules" :model="form"
                   label-width="120px" style="padding-right: 20px">

            <el-form-item label="上传异常追溯码" style="position: relative">
              <oms-upload-relation uploadUrl="/qingstor/code/pre" deleteUrl="/code-upload/file" :multiple="false"
                                   :fileList="fileList" :formData="{objectType:'traceCodeByOrg'}"
                                   @change="changeFiles" @isProgress="onUploadProgress"
                                   :clearUploadFiles="clearUploadFiles"
                                   @refreshCodes="setIsUploading(true)"></oms-upload-relation>
              <el-tag class="mt-10" v-show="uploading" type="warning">正在上传文件, 请勿关闭窗口</el-tag>
              <div class="waring-tag">
                <i class="el-icon-warning"></i> 只能选择单个文件上传
              </div>
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
        rules: {},
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
      goodsChange(val) {
        this.form.batchNumberIdList = [];
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
          if (!this.form.attachmentIdList.length) {
            return this.$notify.info({message: '请选择异常追溯码文件'});
          }
          if (this.form.attachmentIdList.length > 1) {
            return this.$notify.info({message: '请选择单个异常追溯码文件'});
          }
          this.doing = true;
          http.post('/code-exception/file', {fileId: this.form.attachmentIdList[0]}).then(res => {
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
