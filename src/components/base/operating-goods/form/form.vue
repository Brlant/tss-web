<style lang="scss" scoped>
  @import "../../../../assets/scss/mixins";

  $leftWidth: 220px;

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
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
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      text-align: left;
      background-color: #eef2f3;

      > ul {
        margin: 0;
      }

      > h2 {
        padding: 0;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        background-color: #eef2f3;
      }

      .list-style {
        cursor: pointer;
        padding: 10px;
        text-align: center;

        span {
          display: inline-block;
          padding: 8px 35px;
        }

        &.active {
          span {
            background-color: $activeColor;
            border-radius: 20px;
            color: $activeColorFont
          }
        }

        &:hover {
          background: #dee9eb
        }

      }

    }

    .content-right {
      > h3 {
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: normal;
        line-height: 55px;
        height: 55px;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        top: 0;
        right: 0;
        left: $leftWidth;
        background: #fff;
        z-index: 2;
      }

      position: absolute;
      top: 0;
      left: $leftWidth;
      right: 0;
      bottom: 0;
      overflow: auto;
      /*.hide-content {*/
      /*display: none;*/
      /*}*/
      /*.show-content {*/
      /*display: block;*/
      /*}*/
    }

    .btn-submit-save {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      text-align: center;
      padding: 15px;
    }

    .min-gutter {
      .el-form-item {
        /*margin-bottom: 20px;*/
      }

      .el-form-item__label {
        font-size: 12px
      }
    }

    .qp-box {
      margin-bottom: 5px;
      padding: 4px;
      box-shadow: 0 2px 1px 0 #ddd;
    }
  }

  .el-form .el-select {
    display: block;
  }

  .el-form .el-date-editor {
    display: block;
  }

  .el-form {
    border: 1px solid #eef2f3;
    margin: 15px 10px;
    padding-top: 15px;
    border-radius: 4px;
    position: relative;

    &.active {
      border-color: $activeColor;

      .title-link {
        color: $activeColor;
      }
    }
  }

  .title-link {
    position: absolute;
    top: -10px;
    left: 5px;
    padding: 0;
  }

</style>
<template>
  <div>
    <div class="content-right min-gutter">
      <h3>{{action === 'add' ? '添加' : '编辑'}}经营货品</h3>
      <div>
        <el-form ref="goodSForm" :model="form" :rules="rules" label-width="120px"
                 @submit.prevent="onSubmit('goodSForm')" onsubmit="return false" style="padding-right: 20px">
          <el-form-item label="货品主档" label-width="120px">
            <el-transfer ref="elTransfer" v-loading="loading"
                         v-model="form.goodsIdList"
                         :props="{key: 'id',label: 'name'}"
                         filter-placeholder="请输入名称搜索货品主档"
                         :data="goodsList"
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
  import {BaseInfo, OperatingGoods} from '@/resources';
  import ScrollMixin from '@/mixins/scrollMixin';

  export default {
    mixins: [ScrollMixin],
    data: function () {
      return {
        form: {
          name: '',
          orgId: '',
          goodsIdList: []
        },
        rules: {
          orgId: [
            {required: true, message: '请选择经营单位', trigger: 'change'}
          ]
        },
        goodsList: [], // oms货品列表
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
        this.goodsList = [];
        this.customerList = [];
        this.form.orgId = this.$store.state.user.userCompanyAddress;
        this.getOmsGoods();
      }
    },
    methods: {
      clearOrg: function () {
        this.goodsList = [];
      },
      filterMethod(query, item) {
        if (!query) return true;
        return item.name && item.name.indexOf(query) > -1 ||
          item.nameAcronymy && item.nameAcronymy.indexOf(query) > -1 ||
          item.namePhonetic && item.namePhonetic.indexOf(query) > -1 ||
          item.code && item.code.indexOf(query) > -1;
      },
      renderFunc(h, option) {
        return (<span title={option.name}>{option.code}-{option.name}
          <div
            class="transfer-list-two-padding-top"> <span>规格：{option.specifications}</span><span> 生产厂商：{option.factoryName}</span></div></span>);
      },
      filterCustomer: function (query) {// 过滤客户
        let params = {
          keyWord: query
        };
        BaseInfo.query(params).then(res => {
          this.customerList = res.data.list;
        });
      },
      getOmsGoods: function (keyWord) {
        let params = {
          keyWord: keyWord,
          deleteFlag: false,
          auditedStatus: 1,
          state: 0
        };
        this.loading = true;
        OperatingGoods.queryUnboundListByOrgId(this.form.orgId, params).then(res => {
          this.goodsList = res.data;
          this.loading = false;
        });
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
          this.form.orgId = this.$store.state.user.userCompanyAddress;
          OperatingGoods.save(this.form).then(() => {
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
