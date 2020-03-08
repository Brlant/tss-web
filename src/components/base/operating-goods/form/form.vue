<style lang="scss" scoped>
  @import "../../../../assets/scss/mixins";

  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
        background: #fff;
      }
      padding-top: 30px;
      left: $leftWidth;
    }
  }


</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter operating-goods">
      <h3>{{action === 'add' ? '添加' : '编辑'}}监管货品白名单</h3>
      <div>
        <el-form ref="goodSForm" :model="form" label-width="120px"
                 @submit.prevent="onSubmit('goodSForm')" onsubmit="return false" style="padding-right: 20px">
          <el-form-item label="监管单位" prop="subjectOrgId" :rules="[
            {required: true, message: '请选择监管单位', trigger: 'change'}
          ]">
            <el-select filterable placeholder="请输入名称搜监管单位" remote :remote-method="queryUpAllFactory"
                       :clearable="true" v-model="form.subjectOrgId"
                       popperClass="good-selects">
              <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in allOrgList">
                <div style="overflow: hidden">
                  <span class="pull-left" style="clear: right">{{org.name}}</span>
                </div>
                <div style="overflow: hidden">
                    <span class="select-other-info pull-left">
                      <span>系统代码:</span>{{org.manufacturerCode}}
                    </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货品主档" label-width="120px">
            <el-transfer ref="elTransfer" v-loading="loading"
                         v-model="form.goodsIdList"
                         :props="{key: 'id',label: 'name'}"
                         filter-placeholder="请输入名称搜索货品主档"
                         :data="platformGoods"
                         filterable
                         :filter-method="filterMethod"
                         :titles="['未选货品', '已选货品']"
                         class="transfer-list-two"
                         :render-content="renderFunc">
            </el-transfer>
          </el-form-item>
          <el-form-item label-width="100px" class="text-center">
            <el-button type="primary" @click="onSubmit('goodSForm')" native-type="submit" :disabled="doing">保存
            </el-button>
            <el-button @click="doClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script type="text/jsx">
  import {BaseInfo, goodsWhiteList} from '@/resources';
  import ScrollMixin from '@/mixins/scrollMixin';
  import MethodMixin from '@/mixins/methodsMixin';
  export default {
    mixins: [ScrollMixin, MethodMixin],
    data: function () {
      return {
        form: {
          name: '',
          subjectOrgId: '',
          goodsIdList: []
        },
        doing: false,
        customerList: [],
        loading: false
      };
    },
    props: ['formItem', 'action', 'actionType', 'title'],
    mounted: function () {
    },
    computed: {},
    watch: {
      formItem: function (val) {
        this.scrollTop();
        this.$refs.elTransfer.clearQuery('left');
        this.$refs.elTransfer.clearQuery('right');
        this.form = val;
        this.filterAllPlatFormGoods();
      }
    },
    methods: {
      filterMethod(query, item) {
        if (!query) return true;
        return item.name && item.name.indexOf(query) > -1 ||
          item.nameAcronymy && item.nameAcronymy.indexOf(query) > -1 ||
          item.namePhonetic && item.namePhonetic.indexOf(query) > -1 ||
          item.code && item.code.indexOf(query) > -1;
      },
      renderFunc(h, option) {
        return (<span title={option.name}>{option.code}-{option.name}
          <div class="transfer-list-two-padding-top"> <span>规格：{option.specifications}</span><span> 生产厂商：{option.factoryName}</span></div></span>);
      },
      onSubmit: function (formName) {
        if (this.form.goodsIdList.length === 0) {
          this.$notify.warning({
            duration: 1500,
            message: '请选择要添加的货品'
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) return;
          this.doing = true;
          let data = this.form.goodsIdList.map(m => ({
            goodsId: m,
            subjectOrgId: this.form.subjectOrgId
          }));
          goodsWhiteList.save(data).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增经营货品成功'
            });
            this.$emit('change', this.form);
            this.$emit('right-close', this.form);
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '新增经营货品失败'
            });
            this.doing = false;
          });
        });
      },
      doClose: function () {
        this.$emit('right-close');
        this.$refs['goodSForm'].resetFields();
      }
    }
  };
</script>
