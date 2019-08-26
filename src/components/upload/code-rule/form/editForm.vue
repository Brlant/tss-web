<style lang="scss" scoped="">

  $leftWidth: 0;
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
<style lang="scss">
  .breaking-form-item {
    .el-form-item__label {
      line-height: 1.5;
    }
  }
</style>
<template>
  <div>
    <div class="content-part">
      <!--<div class="content-left">-->
      <!--<h2 class="clearfix right-title">{{actionType==='edit' ? '编辑' : '添加'}}</h2>-->
      <!--<ul>-->
      <!--<li class="list-style" v-for="item in productListSet" @click="index = item.key"-->
      <!--:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>-->
      <!--</li>-->
      <!--<li class="text-center" style="margin-top:30px;position:absolute;bottom:50px;left:0;right:0;">-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <div class="content-right min-gutter">
        <h3>{{actionType==='edit' ? '编辑' : '添加'}}</h3>
        <div class="hide-content" :class="{'show-content' : index==0}">
          <el-form ref="batchForm" :rules="rules" :model="form" label-width="160px" class="min-gutter"
                   @submit.prevent="submitForm()" onsubmit="return false" style="padding-right: 20px">
            <el-form-item label="货品" prop="operateGoodsId" v-show="this.actionType !== 'edit'">
              <el-select placeholder="请输入名称搜索货品" v-model="form.operateGoodsId" filterable remote
                         :remote-method="queryManageGoods"
                         :clearable="true" popperClass="custom-select" @click.native.once="queryManageGoods('')">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in manageGoods">
                  <manage-goods-option :optionItem="item"/>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="追溯码GTIN值" prop="gtin">
              <oms-input placeholder="请输入追溯码GTIN值" v-model.trim="form.gtin"></oms-input>
            </el-form-item>
            <el-form-item label="追溯码GTIN的应用标识符（AI）" prop="gtinAi" class="breaking-form-item">
              <oms-input placeholder="请输入追溯码GTIN的应用标识符" v-model.trim="form.gtinAi"></oms-input>
            </el-form-item>
            <el-form-item label="货品项目编码" prop="goodsNo">
              <oms-input placeholder="请输入货品项目编码" v-model.trim="form.goodsNo"></oms-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="货品项目编码起始位置" prop="goodsNoIndex">
                  <oms-input placeholder="请输入货品项目编码起始位置" v-model.trim.number="form.goodsNoIndex"></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货品项目编码长度" prop="goodsNoLength">
                  <oms-input placeholder="请输入货品项目编码长度" v-model.trim.number="form.goodsNoLength"></oms-input>
                </el-form-item>
              </el-col>
            </el-row>


            <el-form-item label="生产日期应用标识符AI" prop="productionDateAi">
              <oms-input placeholder="请输入生产日期应用标识符AI" v-model.trim="form.productionDateAi"></oms-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="生产日期起始位置" prop="productionDateIndex">
                  <oms-input placeholder="请输入生产日期起始位置" v-model.trim.number="form.productionDateIndex"></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生产日期编码长度" prop="productionDateLength">
                  <oms-input placeholder="请输入生产日期编码长度" v-model.trim.number="form.productionDateLength"></oms-input>
                </el-form-item>
              </el-col>
            </el-row>


            <el-form-item label="有效期应用标识符AI" prop="effectiveDateAi">
              <oms-input placeholder="请输入有效期应用标识符AI" v-model.trim="form.effectiveDateAi"></oms-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="有效期编码起始位置" prop="effectiveDateIndex">
                  <oms-input placeholder="请输入有效期编码起始位置" v-model.trim.number="form.effectiveDateIndex"></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期编码长度" prop="effectiveDateLength">
                  <oms-input placeholder="请输入有效期编码长度" v-model.trim.number="form.effectiveDateLength"></oms-input>
                </el-form-item>
              </el-col>
            </el-row>


            <el-form-item label="批号应用标识符AI" prop="batchNumberAi">
              <oms-input placeholder="请输入批号应用标识符AI" v-model.trim="form.batchNumberAi"></oms-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="批号编码起始位置" prop="batchNumberIndex">
                  <oms-input placeholder="请输入批号编码起始位置" v-model.trim.number="form.batchNumberIndex"></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批号编码长度" prop="batchNumberLength">
                  <oms-input placeholder="请输入批号编码长度" v-model.trim.number="form.batchNumberLength"></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="submitForm()" :disabled="doing">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {http} from '../../../../resources';
  import methodsMixin from '@/mixins/methodsMixin';
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
          operateGoodsId: '',
          goodsId: '',
          gtin: '',
          gtinAi: '02',
          goodsNo: '',
          goodsNoIndex: '',
          goodsNoLength: '',
          productionDateAi: '11',
          productionDateIndex: '',
          productionDateLength: '',
          effectiveDateAi: '17',
          effectiveDateIndex: '',
          effectiveDateLength: '',
          batchNumberAi: '10',
          batchNumberIndex: '',
          batchNumberLength: ''
        },
        rules: {
          operateGoodsId: [
            {required: true, message: '请选择货品', trigger: 'change'}
          ],
          gtin: [
            {required: true, message: '请输入追溯码GTIN值', trigger: 'blur'},
            {max: 30, message: '长度不能超过30个字符', trigger: 'blur'}
          ],
          gtinAi: [
            {required: true, message: '请输入追溯码GTIN的应用标识符（AI）', trigger: 'blur'},
            {max: 30, message: '长度不能超过30个字符', trigger: 'blur'}
          ],
          goodsNo: [
            {max: 30, message: '长度不能超过30个字符', trigger: 'blur'}
          ],
          goodsNoIndex: [],
          goodsNoLength: [],
          productionDateAi: [
            {max: 30, message: '长度不能超过30个字符', trigger: 'blur'}
          ],
          productionDateIndex: [],
          productionDateLength: [],
          effectiveDateAi: [
            {max: 30, message: '长度不能超过30个字符', trigger: 'blur'}
          ],
          effectiveDateIndex: [],
          effectiveDateLength: [],
          batchNumberAi: [
            {max: 30, message: '长度不能超过30个字符', trigger: 'blur'}
          ],
          batchNumberIndex: [],
          batchNumberLength: []
        },
        productListSet: [
          {name: '基本信息', key: 0}
        ],
        index: 0,
        doing: false,
        Util
      };
    },
    watch: {
      currentItem(val) {
        this.resetForm();
        this.form = Object.assign({}, this.form, val);
        if (val.goodsId) {
          this.manageGoods = [{
            name: val.goodsName,
            goodsId: val.goodsId,
            id: val.goodsId
          }];
        }
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
      resetForm() {
        this.form = {
          operateGoodsId: '',
          goodsId: '',
          gtin: '',
          gtinAi: '02',
          goodsNo: '',
          goodsNoIndex: '',
          goodsNoLength: '',
          productionDateAi: '11',
          productionDateIndex: '',
          productionDateLength: '',
          effectiveDateAi: '17',
          effectiveDateIndex: '',
          effectiveDateLength: '',
          batchNumberAi: '10',
          batchNumberIndex: '',
          batchNumberLength: ''
        };
      },
      submitForm() {
        this.$refs['batchForm'].validate(valid => {
          if (!valid) {
            this.index = 0;
            return;
          }
          this.doing = true;
          if (this.actionType === 'edit') {
            http.put('/gs1-rule/' + this.form.id, this.form).then(res => {
              this.$notify.success({
                message: '修改成功'
              });
              this.doing = false;
              this.$emit('change');
              this.$emit('close');
            }).catch(err => {
              this.doing = false;
              this.$notify.error({
                message: err.response.data && err.response.data.msg || '修改失败'
              });
            });
          } else {
            // 传平台货品id
            this.manageGoods.forEach(i => {
              if (i.id === this.form.operateGoodsId) {
                this.form.goodsId = i.goodsId;
              }
            });
            http.post('/gs1-rule', this.form).then(res => {
              this.$notify.success({
                message: '新增成功'
              });
              this.doing = false;
              this.$emit('change');
              this.$emit('close');
              this.resetForm();
            }).catch(err => {
              this.doing = false;
              this.$notify.error({
                message: err.response.data && err.response.data.msg || '新增失败'
              });
            });
          }
        });
      }
    }
  };
</script>
