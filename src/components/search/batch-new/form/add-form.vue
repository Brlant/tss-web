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
        <h3>添加批号追溯任务</h3>
        <div class="hide-content show-content">
          <el-form ref="form" :rules="rules" :model="form"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item label="货品" prop="goodsId">
              <!--<el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable remote-->
              <!--:remote-method="queryManageGoods" @change="goodsChange"-->
              <!--:clearable="true" popperClass="custom-select" @click.native.once="queryManageGoods('')">-->
              <!--<el-option :label="item.name" :value="item.goodsId" :key="item.id" v-for="item in manageGoods">-->
              <!--<manage-goods-option :optionItem="item"/>-->
              <!--</el-option>-->
              <!--</el-select>-->
              <el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable remote clearable
                         :remote-method="filterPermPlatFormGoods" @change="goodsChange"
                         popperClass="custom-select" @click.native.once="filterPermPlatFormGoods('')">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                  <div>
                    <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                    <span class="pull-right select-other-info">
                      {{item.typeId|formatGoodsTypeList}}<span v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'" :dict-key="item.vaccineSign"></dict></span>
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
            <el-form-item label="批号" prop="batchNumberId">
              <el-select v-model="form.batchNumberId" filterable clearable remote  @change="batchNumberChange"
                         :remoteMethod="queryGoodsNumber('form.goodsId', false)" placeholder="请输入批号名称搜索批号">
                <el-option v-for="item in goodsBatchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber"/>
              </el-select>
            </el-form-item>

            <el-form-item label="业务时间">
              <el-date-picker class="date-time-range-max" v-model="form.times" type="daterange"
                              start-placeholder="开始时间" end-placeholder="结束时间"/>
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
  import {http} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    props: ['defaultIndex'],
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          goodsId: null,
          batchNumberId: '',
          times: [],
          codeBatchEndTime: null,
          codeBatchStartTime: null
        },
        rules: {
          goodsId: {required: true, message: '请选择货品', trigger: 'change'},
          batchNumberId: {required: true, message: '请选择批号', trigger: 'change'},
          times: {required: true, type: 'array', message: '请选择业务时间', trigger: 'change'}
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
        this.form.batchNumberId = '';
        this.goodsBatchNumberList = [];
        if (!val) return;
        this.queryGoodsNumber('form.goodsId')('');
      },
      batchNumberChange(val) {
        if (!val || this.form.goodsId) return;
        let item = this.goodsBatchNumberList.find(f => f.id === val);
        if (!item) return;
        this.filterPermPlatFormGoods(item.goodsName).then(res => {
          if (!this.platformGoods.length) {
            return this.$notify.info('根据此批号查不到对应的货品');
          }
          this.form.goodsId = item.goodsId;
          this.queryGoodsNumber('form.goodsId')('');
        });
      },
      resetForm() {
        this.form = {
          goodsId: null,
          batchNumberId: '',
          count: null,
          times: [],
          codeBatchEndTime: null,
          codeBatchStartTime: null
        };
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          let form = JSON.parse(JSON.stringify(this.form));
          form.startTime = this.form.times[0] && this.$moment(this.form.times[0]).format('YYYY-MM-DD');
          form.endTime = this.form.times[1] && this.$moment(this.form.times[1]).format('YYYY-MM-DD');
          form.times = undefined;
          this.doing = true;
          http.post('/code-biz/batch-task', form).then(res => {
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
