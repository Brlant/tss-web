<style lang="scss" scoped="">
  @import "../../../../assets/scss/mixins";

  $leftWidth: 0;
  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;

    .content-left {
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
      padding: 65px 20px 0 20px;

      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 20px;
      }

      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .el-form .el-select {
    display: block;
  }

  .el-form .el-cascader {
    display: block;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3 class="clearfix">添加被监管单位</h3>
        <el-form ref="form" :model="form" label-width="100px"
                 @submit.prevent="onSubmit()" onsubmit="return false" v-loading="loading">
          <el-form-item label="监管单位" prop="orgId" :rules="[
            {required: true, message: '请选择监管单位', trigger: 'change'}
          ]">
            <el-select filterable placeholder="请输入名称搜监管单位" remote :remote-method="queryUpAllFactory"
                       :clearable="true" v-model="form.orgId"
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

          <el-form-item label-width="0" prop="orgIdList"
                        :rules="[{required: true, type: 'array', message: '请选择被监管单位', trigger: 'change'}]">
            <el-transfer ref="elTransfer" v-model="form.orgIdList"
                         :props="{key: 'id',label: 'name'}"
                         filter-placeholder="请输入名称搜索被监管单位"
                         :data="downOrgList"
                         filterable
                         :filter-method="filterMethod"
                         :titles="['未选被监管单位', '已选被监管单位']"
                         class="transfer-list"
                         :render-content="renderFuncPOV">
            </el-transfer>
          </el-form-item>
          <div style="margin-left: 100px">
            <el-button type="primary" @click="onSubmit('form')" native-type="submit" :disabled="doing">保存</el-button>
            <el-button @click="doClose">取消</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import {whiteList} from '@/resources';
  import MethodMixin from '@/mixins/methodsMixin';

  export default {
    name: 'editForm',
    mixins: [MethodMixin],
    props: {
      showRight: Boolean
    },
    data: function () {
      return {
        form: {
          orgId: '',
          orgIdList: []
        },
        doing: false,
        loading: false
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    watch: {
      showRight: function () {
        this.queryUpAllFactory();
        this.queryDownAllFactory().then(res => {
          this.loading = false;
        });

        this.form = {
          orgId: '',
          orgIdList: []
        };
        this.loading = true;
        this.$refs.elTransfer && this.$refs.elTransfer.clearQuery('left');
        this.$refs.elTransfer && this.$refs.elTransfer.clearQuery('right');

        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      renderFuncPOV(h, option) {
        return (
          <span title={option.name}>{option.name}</span>
        );
      },
      filterMethod(query, item) {
        if (!query) return true;
        return item.name && item.name.indexOf(query) > -1 ||
          item.nameAcronymy && item.nameAcronymy.indexOf(query) > -1 ||
          item.namePhonetic && item.namePhonetic.indexOf(query) > -1 ||
          item.creditCode && item.creditCode.indexOf(query) > -1;
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          whiteList.save(this.form.orgId, this.form.orgIdList).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '添加成功'
            });
            this.$emit('change');
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '添加失败'
            });
            this.doing = false;
          });
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['form'].resetFields();
      }
    }
  };
</script>
