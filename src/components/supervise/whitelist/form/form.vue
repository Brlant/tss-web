<style lang="scss" scoped="">
  @import "../../../../assets/scss/mixins";

  $leftWidth: 180px;
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
      <div class="content-left">
        <h2 class="clearfix">添加</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="activeIndex = item.key"
              :class="{ 'active' : activeIndex===item.key}">
            <span>{{ item.name }}            <span v-show="form.orgIdList.length && item.key === 1">({{form.orgIdList.length}})</span></span>
          </li>
          <li class="text-center" style="margin-top:30px;position:absolute;bottom:50px;left:0;right:0;">
              <el-button type="primary" @click="onSubmit('form')" native-type="submit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3 class="clearfix">添加被监管单位</h3>
        <el-form ref="form" :model="form" label-width="100px"
                 @submit.prevent="onSubmit()" onsubmit="return false" v-loading="loading">
          <el-form-item label="监管单位" prop="orgId" :rules="[
            {required: true, message: '请选择监管单位', trigger: 'change'}
          ]" v-show="activeIndex === 0">
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

          <el-form-item prop="orgIdList" label="被监管单位"
                        :rules="[{required: true, type: 'array', message: '请选择被监管单位', trigger: 'change'}]">
            <div v-show="activeIndex === 0">
              <el-row >
                <el-col :span="12">
                  <oms-form-row :span="8" label="单位分类">
                    <el-select :clearable="true" filterable multiple
                               popperClass="custom-select" remote v-model="filters.orgRelationType">
                      <el-option :key="item.key" :label="item.label" :value="item.key" v-for="item in orgRelationType">
                      </el-option>
                    </el-select>
                  </oms-form-row>
                </el-col>
                <el-col :span="12">
                  <oms-form-row :span="8" label="所在地区">
                    <el-cascader :options="options" clearable v-model="filters.selectOptions"
                                 placeholder="请选择省市区" @change="filterObjectOrgList"
                                 :change-on-select="true" style="display: block"></el-cascader>
                  </oms-form-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <oms-form-row :span="8" label="单位名称">
                    <el-input v-model="filters.keyWord" placeholder="请输入单位名称"></el-input>
                  </oms-form-row>
                </el-col>
                <el-col :span="8">
                  <oms-form-row :span="2" label="">
                    <el-button @click="searchInOrder" native-type="submit" plain type="primary">查询</el-button>
                    <el-button @click="resetSearchForm">重置</el-button>
                  </oms-form-row>
                </el-col>
              </el-row>
            </div>
            <table-paging-select maxHeight="" :showNoSelect="activeIndex === 0" :showSelect="activeIndex === 1"
                                 ref="pagingSelect" primaryKey="id" :filters="filters" @change="pagingSelectChange"
                                 :http-request="httpRequest" :column-list="columnList"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import {DhsBaseInfo, whiteList} from '@/resources';
  import MethodMixin from '@/mixins/methodsMixin';
  import tablePagingSelect from '@/components/common/table-paging-select.vue';
  import utils from '@/tools/utils';

  export default {
    name: 'editForm',
    mixins: [MethodMixin],
    components: {tablePagingSelect},
    props: {
      showRight: Boolean
    },
    data: function () {
      let orgRelationType = this.$store.state.orgRelationType;
      return {
        form: {
          orgId: '',
          orgIdList: [],
        },
        options: utils.address,
        columnList: [
          {
            label: '单位名称',
            prop: 'name',
            width: 240
          },
          {
            label: '单位分类',
            prop: 'orgRelationTypeList',
            width: 150,
            format(val) {
              if (!val) return '';
              return val.map(m => {
                let item = orgRelationType.find(f => f.key === m);
                return item && item.label || m;
              }).join(',');
            }
          },
          {
            label: '系统代码',
            prop: 'manufacturerCode',
            width: 200
          }
        ],
        filters: {
          orgRelationType: [],
          selectOptions: [],
          keyWord: '',
          province: '',
          city: '',
          region: ''
        },
        productListSet: [
          {key: 0, name: '未选单位'},
          {key: 1, name: '已选单位'}
        ],
        activeIndex: 0,
        doing: false,
        loading: false
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      orgRelationType() {
        return this.$store.state.orgRelationType;
      }
    },
    watch: {
      showRight: function () {
        this.resetForm();
        this.$refs.pagingSelect.init();
        this.queryUpAllFactory();
        this.form = {
          orgId: '',
          orgIdList: []
        };
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      httpRequest: DhsBaseInfo.queryPager,
      pagingSelectChange(val) {
        if (val) {
          this.form.orgIdList = val.map(m => m.id);
        } else {
          this.form.orgIdList = [];
        }
        this.$refs.form.validateField('orgIdList');
      },
      filterObjectOrgList(val) {
        let ary = utils.formatAddressByType(val[0], val[1], val[2], 'label');
        this.filters.province = ary[0];
        this.filters.city = ary[1];
        this.filters.region = ary[2];
      },
      searchInOrder() {
        this.$refs.pagingSelect.queryList(1);
      },
      resetForm() {
        this.filters = {
          orgRelationType: [],
          selectOptions: [],
          keyWord: '',
          province: '',
          city: '',
          region: ''
        };
      },
      resetSearchForm() {
        this.resetForm();
        this.$nextTick(() => {
          this.$refs.pagingSelect.queryList(1);
        })
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          let list = this.form.orgIdList.map(m => {
            return {
              objectOrgId: m,
              subjectOrgId: this.form.orgId
            };
          });
          this.doing = true;
          whiteList.save(list).then(() => {
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
