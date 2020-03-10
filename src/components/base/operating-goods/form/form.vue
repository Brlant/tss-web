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
          <el-form-item label="货品主档" label-width="120px" prop="goodsIdList" :rules="[
                    {required: true, type: 'array', message: '请选择货品主档', trigger: 'change'}
                  ]">
            <el-row>
              <el-col :span="10">
                <oms-form-row :span="8" label="货品分类">
                  <el-select :clearable="true" filterable
                             popperClass="custom-select" remote v-model="filters.typeId">
                    <el-option :key="item.key" :label="item.label" :value="item.key" v-for="item in goodsTypeList">
                    </el-option>
                  </el-select>
                </oms-form-row>
              </el-col>
              <el-col :span="10">
                <oms-form-row :span="6" label="货品名称">
                  <el-input v-model="filters.keyWord"></el-input>
                </oms-form-row>
              </el-col>
              <el-col :span="4">
                <oms-form-row :span="2" label="">
                  <el-button @click="searchInOrder" native-type="submit" plain type="primary">查询</el-button>
                  <el-button @click="resetSearchForm">重置</el-button>
                </oms-form-row>
              </el-col>
            </el-row>
            <table-paging-select ref="pagingSelect" primaryKey="id" :filters="filters" @change="pagingSelectChange"
                                 :http-request="httpRequest" :column-list="columnList"/>
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
  import {Goods, goodsWhiteList} from '@/resources';
  import ScrollMixin from '@/mixins/scrollMixin';
  import MethodMixin from '@/mixins/methodsMixin';
  import tablePagingSelect from '@/components/common/table-paging-select.vue';

  export default {
    mixins: [ScrollMixin, MethodMixin],
    components: {tablePagingSelect},
    data: function () {
      let goodsTypeList = this.$store.state.goodsTypeList;
      return {
        form: {
          name: '',
          subjectOrgId: '',
          goodsIdList: []
        },
        doing: false,
        columnList: [
          {
            label: '货品编号',
            prop: 'code',
            width: 100
          },
          {
            label: '货品分类',
            prop: 'typeId',
            width: 150,
            format(val) {
              let item = goodsTypeList.find(f => f.key === val);
              return item && item.label || val;
            }
          },
          {
            label: '货品名称',
            prop: 'name',
            width: 200
          },
          {
            label: '规格',
            prop: 'specifications',
            width: 200
          },
          {
            label: '生产厂商',
            prop: 'factoryName',
            width: 200
          }
        ],
        customerList: [],
        filters: {
          auditedStatus: 1,
          state: 0,
          typeId: '',
          keyWord: ''
        },
        loading: false
      };
    },
    props: ['formItem', 'action', 'actionType', 'title'],
    mounted: function () {
    },
    computed: {
      goodsTypeList() {
        return this.$store.state.goodsTypeList;
      }
    },
    watch: {
      formItem: function (val) {
        this.filters.typeId = '';
        this.filters.keyWord = '';
        this.$refs.pagingSelect.init();
        this.form = val;
        this.$nextTick(() => {
          this.$refs.goodSForm.clearValidate();
        })
      }
    },
    methods: {
      httpRequest: Goods.query,
      pagingSelectChange(val) {
        if (val) {
          this.form.goodsIdList = val.map(m => m.id);
        } else {
          this.form.goodsIdList = [];
        }
        this.$refs.goodSForm.validateField('goodsIdList');
      },
      searchInOrder() {
        this.$refs.pagingSelect.queryList(1);
      },
      resetSearchForm() {
        this.filters.typeId = '';
        this.filters.keyWord = '';
        this.$refs.pagingSelect.queryList(1);
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) return;
          if (this.form.goodsIdList.length === 0) {
            this.$notify.warning({
              duration: 1500,
              message: '请选择要添加的货品'
            });
            return;
          }
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
