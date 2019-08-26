<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警事件查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="发生时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="6" label="操作类型">
              <el-select filterable placeholder="请输入操作类型" v-model="searchCondition.type">
                <el-option :key="item.key" :label="item.label" :value="item.key" v-for="item in operaType"/>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="操作单位">
              <org-select :list="allOrgList" :remoteMethod="queryAllFactory" @change="orgChange"
                          placeholder="请输入名称搜索操作单位" v-model="searchCondition.org"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="8" label="操作人">
              <el-select :remote-method="queryOrgAccountList('searchCondition.org')" clearable
                         filterable placeholder="请选择操作人" remote v-model="searchCondition.createdBy">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in orgUsers"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="8">-->
          <!--<oms-form-row label="异常类型" :span="8">-->
          <!--<oms-input placeholder="请输入异常类型" v-model="searchCondition.devName" @keyup.native.enter="search"/>-->
          <!--</oms-form-row>-->
          <!--</el-col>-->
        </el-row>
        <el-row class="mt-10">
          <el-col :span="6">
            <oms-form-row :span="6" label="">
              <el-button @click="search" plain type="primary">查询</el-button>
              <el-button @click="reset" native-type="reset">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    props: {
      operaType: Object
    },
    data: function () {
      return {
        searchCondition: {
          startTime: '',
          endTime: '',
          type: '',
          createdBy: '',
          org: ''
        },
        showSearch: false,
        list: [],
        times1: []
      };
    },
    methods: {
      search() {
        const parent = this.$parent;
        this.searchCondition.startTime = parent.formatTimeAry(this.times1, 0);
        this.searchCondition.endTime = parent.formatTimeAry(this.times1, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          startTime: '',
          endTime: '',
          type: '',
          createdBy: '',
          org: ''
        };
        this.times1 = [];
        this.orgUsers = [];
        this.$emit('search', this.searchCondition);
      },
      orgChange(val) {
        this.searchCondition.createdBy = '';
        this.queryOrgAccountList('searchCondition.org')();
        this.orgUsers = [];
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
