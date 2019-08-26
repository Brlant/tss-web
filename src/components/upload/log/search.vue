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
            <oms-form-row :span="5" label="上传时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini"
                              placeholder="请选择" type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="上传单位">
              <org-select :list="allOrgList" :remoteMethod="queryAllFactory" @change="orgChange"
                          placeholder="请输入名称搜索上传单位" v-model="searchCondition.org"></org-select>
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
          <el-col :span="4">
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
    data: function () {
      return {
        searchCondition: {
          startTime: '',
          endTime: '',
          creatorName: '',
          org: '',
          createdBy: ''
        },
        showSearch: false,
        list: [],
        times1: [],
        times2: []
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
          org: '',
          creatorName: '',
          createdBy: ''
        };
        this.times1 = [];
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
