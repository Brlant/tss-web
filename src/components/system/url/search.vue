<template>

  <div :class="{up:!showSearch}" class="opera-btn-group">
    <div class="opera-icon">
      <div class="pull-right">
        <des-btn class="pull-right" perm="code-push-address-add" icon="plus" @click="addOrgAccount">添加配置</des-btn>
      </div>
    </div>
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="上游单位">
              <org-select :list="allOrgList" :remoteMethod="queryUpAllFactory" @change="orgChange"
                          placeholder="请输入名称搜索上游单位" v-model="searchCondition.upstreamOrgId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="下游单位">
              <org-select :list="downOrgList" :remoteMethod="queryDownAllFactory"
                          placeholder="请输入名称搜索下游单位" v-model="searchCondition.downstreamOrgId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="3" label="货品">
              <el-select :clearable="true" :filter-method="filterPlatFormGoods" @click.native.once="filterPlatFormGoods()" filterable
                         placeholder="请输入名称搜索货品" popper-class="custom-select"
                         v-model="searchCondition.goodsId">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                  <div>
                    <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                    <span class="pull-right select-other-info">
                      {{item.typeId|formatGoodsTypeList}}<span v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'" :dict-key="item.vaccineSign"></dict></span>
                    </span>
                  </div>
                  <div class="clearfix">
                    <span class="pull-left select-other-info" v-if="item.code">货品编号:{{ item.code }}</span>
                    <span class="pull-right select-other-info">规格:{{ item.specifications }}</span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row class="mt-10">
          <el-col :span="8">
            <oms-form-row :span="5" label="生产厂商">
              <org-select :list="factories" :remoteMethod="queryFactory"
                          placeholder="请输入名称搜索生产厂商" v-model="searchCondition.factoryId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="回调单位">
              <org-select :list="callOrgList" :remoteMethod="queryCallAllFactory"
                          placeholder="请输入名称搜索回调单位" v-model="searchCondition.pushOrgId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="4" label="">
              <el-button @click="search" plain type="primary">查询</el-button>
              <el-button @click="reset" native-type="reset">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
  </div>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          upstreamOrgId: '',
          goodsId: '',
          downstreamOrgId: '',
          pushOrgId: '',
          factoryId: ''
        },
        showSearch: false,
        list: [],
        times1: []
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          upstreamOrgId: '',
          goodsId: '',
          downstreamOrgId: '',
          pushOrgId: '',
          factoryId: ''
        };
        this.times1 = [];
        this.orgUsers = [];
        this.$emit('search', this.searchCondition);
      },
      orgChange(val) {

      },
      addOrgAccount () {
        this.$emit('addOrgAccount');
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
