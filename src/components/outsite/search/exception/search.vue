<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警事件查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="10">
            <oms-form-row :span="5" label="上报时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini"
                              placeholder="请选择" type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
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
  export default {
    data: function () {
      return {
        searchCondition: {
          occurBegin: '',
          occurEnd: '',
          restoreBegin: '',
          restoreEnd: '',
          devName: '',
          confirmStatus: ''
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
        this.searchCondition.occurBegin = parent.formatTimeAry(this.times1, 0);
        this.searchCondition.occurEnd = parent.formatTimeAry(this.times1, 1);
        this.searchCondition.restoreBegin = parent.formatTimeAry(this.times2, 0);
        this.searchCondition.restoreEnd = parent.formatTimeAry(this.times2, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          occurBegin: '',
          occurEnd: '',
          restoreBegin: '',
          restoreEnd: '',
          devName: '',
          confirmStatus: ''
        };
        this.times1 = [];
        this.times2 = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
