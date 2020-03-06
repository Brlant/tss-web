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
            <oms-form-row label="被监管单位" :span="6" isRequire>
              <el-select filterable placeholder="请输入名称搜监管单位"
                         :clearable="true" v-model="searchCondition.objectOrgId"
                         popperClass="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in downOrgList">
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
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="被监管货品" isRequire>
              <el-select  @change="goodsChange" clearable
                         placeholder="请输入名称搜索被监管货品"
                         popperClass="custom-select" remote
                         v-model="searchCondition.goodsId">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                  <div>
                    <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                    <span class="pull-right select-other-info">
                      <dict :dict-group="'typeId'" :dict-key="item.typeId"></dict><span
                      v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'"
                                                                              :dict-key="item.vaccineSign"></dict></span>
                    </span>
                  </div>
                  <div class="clearfix">
                    <span class="pull-left select-other-info" v-if=" item.code">货品编号:{{ item.code }}</span>
                    <span class="pull-right select-other-info">规格:{{ item.specifications }}</span>
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="批号">
              <el-select :remoteMethod="queryGoodsNumber('searchCondition.goodsId')" clearable filterable
                         placeholder="请输入批号名称搜索批号"
                         remote v-model="searchCondition.batchNumberId">
                <el-option :key="item.id" :label="item.batchNumber" :value="item.id"
                           v-for="item in goodsBatchNumberList"/>
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row class="mt-10">
          <el-col :span="8">
            <oms-form-row :span="6" label="追溯码">
              <el-input placeholder="请输入追溯码" v-model="searchCondition.code"></el-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="使用/销售单位">
              <org-select :list="allOrgList" :remoteMethod="queryAllFactory"
                          placeholder="请输入名称搜索使用/销售单位" v-model="searchCondition.orgId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="使用/销售时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini"
                              placeholder="请选择" type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row class="mt-10">
          <el-col :span="8">
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
          code: '',
          goodsId: '',
          orgId: '',
          batchNumberId: '',
          objectOrgId: '',
        },
        showSearch: false,
        list: [],
        times1: []
      };
    },
    mounted() {
      this.queryPermDownAllFactory('all-logistics-trace-query');
      this.filterPermPlatFormGoods('all-terminal-trace-query');
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
          code: '',
          goodsId: '',
          orgId: '',
          batchNumberId: '',
          objectOrgId: ''
        };
        this.times1 = [];
        this.orgUsers = [];
        this.goodsBatchNumberList = [];
        this.$emit('clear', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      },
      goodsChange(val) {
        this.searchCondition.batchNumberId = '';
        this.goodsBatchNumberList = [];
      }
    }
  };
</script>
