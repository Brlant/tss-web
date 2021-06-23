<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="accountform" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item label="上游单位" prop="upstreamOrgId">
        <org-select :list="allOrgList" :remoteMethod="queryUpAllFactory"
                    placeholder="请输入名称搜索上游单位" v-model="form.upstreamOrgId"></org-select>
      </el-form-item>
      <el-form-item label="下游单位" prop="downstreamOrgId">
        <org-select :list="downOrgList" :remoteMethod="queryDownAllFactory"
                    placeholder="请输入名称搜索下游单位" v-model="form.downstreamOrgId"></org-select>
      </el-form-item>
      <el-form-item label="货品" prop="goodsId" v-if="form.id" key="updateFrom">
        <el-select placeholder="请输入名称搜索货品" v-model="form.goodsId" filterable :clearable="true"
                   popper-class="custom-select" :filter-method="filterDhsPlatFormGoods"
                   @click.native.once="filterDhsPlatFormGoods()">
          <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in platformGoods">
            <div>
              <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
              <span class="pull-right select-other-info" v-show="item.typeId">
                      {{item.typeId|formatGoodsTypeList}}
                    </span>
            </div>
            <div class="clearfix">
              <span class="select-other-info" v-if="item.code">货品编号:{{ item.code }}</span>
              <span class="ml-10 select-other-info">规格:{{ item.specifications }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货品" prop="goodsIdList" v-else key="addFrom">
        <el-select placeholder="请输入名称搜索货品" v-model="form.goodsIdList" filterable clearable multiple
                   popper-class="custom-select" :filter-method="filterDhsPlatFormGoods"
                   @click.native.once="filterDhsPlatFormGoods()">
          <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in platformGoods">
            <div>
              <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
              <span class="pull-right select-other-info" v-show="item.typeId">
                      {{item.typeId|formatGoodsTypeList}}
                    </span>
            </div>
            <div class="clearfix">
              <span class="select-other-info" v-if="item.code">货品编号:{{ item.code }}</span>
              <span class="ml-10 select-other-info">规格:{{ item.specifications }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回调单位" prop="pushOrgId">
        <org-select :list="callOrgList" :remoteMethod="queryCallAllFactory" @change="orgChange"
                    placeholder="请输入名称搜索回调单位" v-model="form.pushOrgId"></org-select>
      </el-form-item>
      <el-form-item label="appKey" prop="appKey">
        <el-select placeholder="请选择appKey" v-model="form.appKey" filterable :clearable="true"
                   popper-class="custom-select">
          <el-option :label="item.clientId" :value="item.clientId" :key="item.clientId" v-for="item in keyList">
            <div>
              <span class="pull-left">{{ item.clientId }}</span>
            </div>
            <div class="clearfix">
              <span class=" select-other-info" v-show="item.pushUrl">推送地址:{{ item.pushUrl }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('accountform')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {PushCode} from '../../../../resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    name: 'editForm',
    mixins: [methodsMixin],
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      title: {
        type: String,
        default: '增加'
      }
    },
    data: function () {
      return {
        roleId: '',
        form: {
          upstreamOrgId: '',
          downstreamOrgId: '',
          pushOrgId: '',
          goodsId: '',
          goodsIdList: [],
          appKey: ''
        },
        rules: {
          upstreamOrgId: [
            {required: true, message: '请选择上游单位', trigger: 'change'}
          ],
          downstreamOrgId: [
            {required: true, message: '请选择下游单位', trigger: 'change'}
          ],
          pushOrgId: [
            {required: true, message: '请选择回调单位', trigger: 'change'}
          ],
          goodsId: [
            {required: true, message: '请选择货品', trigger: 'change'}
          ],
          goodsIdList: [
            {required: true, type: 'array', message: '请选择货品', trigger: 'change'}
          ],
          appKey: [
            {required: true, message: '请选择appKey', trigger: 'change'}
          ]
        },
        keyList: [],
        doing: false
      };
    },
    watch: {
      formItem: {
        handler(val) {
          if (val.id) {
            this.platformGoods = [
              {
                name: val.goodsName,
                factoryName: val.factoryName,
                specifications: val.specification,
                id: val.goodsId
              }
            ];
            this.allOrgList = [
              {
                name: val.upstreamOrgName,
                id: val.upstreamOrgId
              }
            ];
            this.downOrgList = [
              {
                name: val.downstreamOrgName,
                id: val.downstreamOrgId
              }
            ];
            this.callOrgList = [
              {
                name: val.pushOrgName,
                id: val.pushOrgId
              }
            ];
            this.form = this.formItem;
            this.queryKeyList();
          } else {
            this.form = {
              upstreamOrgId: '',
              downstreamOrgId: '',
              pushOrgId: '',
              goodsId: '',
              goodsIdList: [],
              appKey: ''
            };
          }
          this.$nextTick(() => {
            this.$refs['accountform'] && this.$refs['accountform'].clearValidate();
          });
        },
        immediate: true
      }
    },
    methods: {
      filterDhsPlatFormGoods(query) { // 查询平台货品
        this.platformGoods = [];
        let params = Object.assign({}, {
          keyWord: query
        });
        this.$http.get('/dhs-goods', {params}).then(res => {
          this.platformGoods = res.data.list;
        });
      },
      orgChange(val) {
        this.form.appKey = '';
        this.keyList = [];
        this.queryKeyList();
      },
      queryKeyList() {
        if (!this.form.pushOrgId) return;
        let params = {
          domainObjectId: 'api-system'
        };
        this.$http.get(`/oauth-client-details/org/${this.form.pushOrgId}`, {params}).then(res => {
          this.keyList = res.data;
          if (this.keyList.length) {
            this.form.appKey = this.keyList[0].clientId;
          }
        });
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          if (!this.form.id) {
            const codePushAddressDtoList = formData.goodsIdList.map(m => {
              const item = Object.assign({}, this.form, {goodsId: m});
              item.goodsIdList = null;
              return item;
            });
            PushCode.save({codePushAddressDtoList}).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                message: '新增成功'
              });
              self.$emit('change', formData);
            }).catch((e) => {
              this.$notify.error({
                duration: 2000,
                message: e.response && e.response.data && e.response.data.msg || '新增失败'
              });
              this.doing = false;
            });
          } else {
            PushCode.update(formData.id, formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                message: '修改成功'
              });
              self.$emit('change', formData);
            }).catch((e) => {
              this.$notify.error({
                duration: 2000,
                message: e.response && e.response.data && e.response.data.msg || '修改失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['accountform'].resetFields();
      }
    }
  };
</script>
