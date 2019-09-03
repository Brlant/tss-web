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
</style>

<template>
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3>上报批号</h3>
      <div class="hide-content show-content">
        <el-form ref="form" :rules="rules" :model="form"
                 label-width="120px" style="padding-right: 20px">
          <el-form-item label="生产厂商" prop="factoryId">
            <org-select v-model="form.factoryId" :list="factories" @change="orgChange"
                        :remoteMethod="queryFactory" placeholder="请输入名称搜索上报单位"></org-select>
          </el-form-item>
          <el-form-item label="货品" prop="goodsId">
            <el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable remote
                       :remote-method="queryManageGoods" @change="goodsChange"
                       :clearable="true" popperClass="custom-select" @click.native.once="queryManageGoods('')">
              <el-option :label="item.name" :value="item.goodsId" :key="item.id" v-for="item in manageGoods">
                <manage-goods-option :optionItem="item"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="批号" prop="batchNumberId">
            <el-select v-model="form.batchNumberId" filterable clearable remote
                       :remoteMethod="queryGoodsBatchNumber" placeholder="请输入批号名称搜索批号">
              <el-option v-for="item in goodsBatchNumberList" :value="item.id" :key="item.id"
                         :label="item.batchNumber"/>
            </el-select>
          </el-form-item>
          <el-form-item label="异常类型" prop="type">
            <el-select filterable clearable placeholder="请选择异常类型"
                       v-model="form.type" style="display: block">
              <el-option :value="exc.key" :key="exc.key" :label="exc.label"
                         v-for="exc in codeExceptionList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发生时间" prop="happenTime">
            <el-date-picker v-model="form.happenTime" format="yyyy-MM-dd HH:mm" type="datetime" :picker-options="{
              disabledDate(time) {
              return time.getTime() > Date.now();
            }
            }" placeholder="请选择"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="doing">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    props: ['defaultIndex'],
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          factoryId: '',
          goodsId: '',
          batchNumberId: '',
          type: '',
          happenTime: ''
        },
        rules: {
          factoryId: {required: true, message: '请选择生产厂商', trigger: 'change'},
          goodsId: {required: true, message: '请选择货品', trigger: 'change'},
          batchNumberId: {required: true, message: '请选择批号', trigger: 'change'},
          type: {required: true, message: '请选择异常类型', trigger: 'change'},
          happenTime: {required: true, message: '请选择发生时间', trigger: 'change'}
        },
        orgGoodsList: [],
        doing: false
      };
    },
    computed: {
      codeExceptionList() {
        return this.$getDict('codeExceptionType');
      }
    },
    watch: {
      defaultIndex(val) {
        this.$refs.form.resetFields();
      }
    },
    methods: {
      orgChange(val) {
        this.form.goodsId = '';
        this.form.batchNumberId = '';
        this.queryManageGoods();
      },
      queryManageGoods(query) {
        if (!this.form.factoryId) return;
        let params = {
          orgId: this.form.factoryId,
          deleteFlag: false,
          keyWord: query,
          auditStatus: '1'
        };
        this.$http.get('/dhs-operation-goods', {params}).then(res => {
          this.manageGoods = res.data.list;
        });
      },
      queryGoodsBatchNumber(query) {
        if (!this.form.goodsId) return;
        this.queryGoodsNumber('form.goodsId')(query);
      },
      goodsChange() {
        this.form.batchNumberId = '';
        this.goodsBatchNumberList = [];
        if (!this.form.goodsId) return;
        this.queryGoodsNumber('form.goodsId')();
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          this.$http.post('code-exception/goods', this.form).then(res => {
            this.doing = false;
            this.$emit('refresh', {id: res.data});
            this.$refs.form.resetFields();
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
