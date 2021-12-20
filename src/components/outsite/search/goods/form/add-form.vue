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
<style lang="scss">
  .date-time-range-max {
    &.el-date-editor--datetimerange.el-input__inner {
      max-width: 100%;
      width: 100%;
    }
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3>添加实物追溯任务</h3>
        <div class="hide-content show-content">
          <el-form ref="form" :rules="rules" :model="form"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="货品" prop="goodsId">
              <el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable remote clearable
                         :remote-method="filterPermPlatFormGoods" @change="goodsChange"
                         popperClass="custom-select" @click.native.once="filterPermPlatFormGoods('')">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                  <div>
                    <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                    <span class="pull-right select-other-info">
                      <dict :dict-group="'typeId'" :dict-key="item.typeId">
                      </dict><span v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'"
                                                                                           :dict-key="item.vaccineSign"></dict></span>
                    </span>
                  </div>
                  <div class="clearfix">
                    <span class="pull-left select-other-info" v-if=" item.code">货品编号:{{ item.code }}</span>
                    <span class="pull-right select-other-info">规格:{{ item.specifications }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0" v-show="form.goodsId">
              <oms-col label="规格" :value="currentGoods.specifications"/>
              <oms-col label="追溯码商品编号" :value="currentGoods.goodsTrackNo" :is-show="true"/>
            </el-form-item>
            <el-form-item label="批号">
              <el-select v-model="form.batchNumberIdList" multiple filterable clearable remote
                         @change="batchNumberChange"
                         :remoteMethod="queryGoodsNumber('form.goodsId', false)" placeholder="请输入批号名称搜索批号">
                <el-option v-for="item in goodsBatchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" :disabled="doing">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {physicalGoodsSearch} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    props: ['defaultIndex'],
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          goodsId: null,
          batchNumberIdList: [],
        },
        rules: {
          goodsId: {required: true, message: '请选择货品', trigger: 'change'},
          batchNumberIdList: {required: true, message: '请选择批号', trigger: 'change'}
        },
        doing: false
      };
    },
    computed: {
      currentGoods() {
        return this.platformGoods.filter(f => f.id === this.form.goodsId)[0] || {};
      }
    },
    watch: {
      defaultIndex(val) {
        this.$refs.form.resetFields();
        this.resetForm();
      }
    },
    methods: {
      goodsChange(val) {
        this.form.batchNumberIdList = [];
        this.goodsBatchNumberList = [];
        if (!val) return;
        this.queryGoodsNumberOut('form.goodsId')('');
      },
      batchNumberChange(val) {
        if (!val.length || val.length > 1 || this.form.goodsId) return;
        let id = val[0];
        let item = this.goodsBatchNumberList.find(f => f.id === id);
        if (!item) return;
        this.filterPermPlatFormGoods(item.goodsName).then(res => {
          if (!this.platformGoods.length) {
            return this.$notify.info('根据此批号查不到对应的货品');
          }
          this.form.goodsId = item.goodsId;
          this.queryGoodsNumberOut('form.goodsId')('');
        });
      },
      resetForm() {
        this.form = {
          goodsId: null,
          batchNumberIdList: []
        };
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          let form = {
            goodsId: this.form.goodsId
          };
          if (this.form.batchNumberIdList.length) {
            form.batchNumberId = this.form.batchNumberIdList.join(',');
          }
          this.doing = true;
          physicalGoodsSearch.save(form).then(res => {
            this.$emit('refresh', res.data);
            this.resetForm();
            this.doing = false;
          }).catch(e => {
            this.$notify.error({
              duration: 2000,
              message: e.response && e.response.data && e.response.data.msg || '保存失败'
            });
            this.doing = false;
          });
        });
      }
    }
  };
</script>
