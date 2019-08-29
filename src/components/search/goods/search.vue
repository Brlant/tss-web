<template>
  <search-template>
    <template slot="content">
      <div class="opera-icon">
        <span class="title">历史查询任务记录筛选</span>
        <span class="pull-right" style="margin-left: 10px">
          <perm label="physical-goods-trace-add">
                <el-button @click="addBatchNumber" type="primary">
                  <i class="el-icon-t-search"/>
                  新增查询任务
                </el-button>
          </perm>
        </span>
      </div>
      <el-form class="advanced-query-form">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="货品">
              <el-select :remote-method="filterPlatFormGoods" @change="goodsChange"
                         @click.native.once="filterPlatFormGoods('')" clearable filterable
                         placeholder="请输入名称搜索货品" popperClass="custom-select"
                         remote v-model="searchCondition.goodsId">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                  <div>
                    <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                    <span class="pull-right select-other-info">
                      <dict :dict-group="'typeId'" :dict-key="item.typeId"></dict><span v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'" :dict-key="item.vaccineSign"></dict></span>
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
<!--          <el-col :span="8">-->
<!--            <oms-form-row :span="5" label="批号">-->
<!--              <el-select :remoteMethod="queryGoodsNumber('searchCondition.goodsId')" clearable filterable placeholder="请输入批号名称搜索批号"-->
<!--                         remote v-model="searchCondition.batchNumberId">-->
<!--                <el-option :key="item.id" :label="item.batchNumber" :value="item.id"-->
<!--                           v-for="item in goodsBatchNumberList"/>-->
<!--              </el-select>-->
<!--            </oms-form-row>-->
<!--          </el-col>-->
          <!--<el-col :span="7">-->
          <!--<oms-form-row label="业务时间" :span="6">-->
          <!--<el-date-picker class="el-date-picker&#45;&#45;mini" v-model="times1" type="datetimerange" placeholder="请选择"/>-->
          <!--&lt;!&ndash;<el-select placeholder="请选择业务类型" v-model="searchCondition.bizType" filterable>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-option :label="item.label" :value="item.value" :key="item.key" v-for="item in bizTypes"/>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
          <!--</oms-form-row>-->
          <!--</el-col>-->
          <el-col :span="11">
            <oms-form-row :span="3" label="">
              <el-button @click="search" plain type="primary">筛选历史记录</el-button>
              <el-button @click="reset" native-type="reset">重置</el-button>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import MethodsMixin from '@/mixins/methodsMixin';
  import DataMixin from '@/mixins/dataMixin';

  export default {
    mixins: [MethodsMixin, DataMixin],
    data: function () {
      return {
        searchCondition: {
          goodsId: '',
          batchNumberId: '',
          bizType: '',
          codeBatchStartTime: '',
          codeBatchEndTime: ''
        },
        times1: []
      };
    },
    methods: {
      search() {
        let {goodsId, batchNumberId} = this.searchCondition;
        const parent = this.$parent;
        this.searchCondition.codeBatchStartTime = parent.formatTimeAry(this.times1, 0);
        this.searchCondition.codeBatchEndTime = parent.formatTimeAry(this.times1, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          goodsId: '',
          batchNumberId: '',
          bizType: '',
          codeBatchStartTime: '',
          codeBatchEndTime: ''
        };
        this.times1 = [];
        this.goodsBatchNumberList = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      },
      goodsChange(val) {
        this.searchCondition.batchNumberId = '';
        this.queryGoodsNumber('searchCondition.goodsId')('');
      },
      addBatchNumber() {
        this.$emit('addBatchNumber');
      }
    }
  };
</script>
