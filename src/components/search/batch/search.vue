<template>
  <search-template>
    <template slot="content">
      <el-form class="advanced-query-form">
        <el-row>
          <el-col :span="8">
            <oms-form-row :isRequire="true" :span="4" label="货品">
              <!--<el-select placeholder="请输入名称搜索货品" v-model="searchCondition.goodsId" filterable remote-->
              <!--:remote-method="queryManageGoods" @change="goodsChange"-->
              <!--:clearable="true" popperClass="custom-select" @click.native.once="queryManageGoods('')">-->
              <!--<el-option :label="item.name" :value="item.goodsId" :key="item.id" v-for="item in manageGoods">-->
              <!--<manage-goods-option :optionItem="item"/>-->
              <!--</el-option>-->
              <!--</el-select>-->
              <!--<goods-select placeholder="请输入名称搜索货品" :remote-method="filterPlatFormGoods"-->
              <!--v-model="searchCondition.goodsId" :list="platformGoods"-->
              <!--@change="goodsChange"></goods-select>-->
              <el-select :remote-method="filterPlatFormGoods" @change="goodsChange" @click.native.once="filterPlatFormGoods('')" clearable filterable
                         placeholder="请输入名称搜索货品" popperClass="custom-select"
                         remote v-model="searchCondition.goodsId">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in platformGoods">
                  <div>
                    <span class="pull-left">{{ item.name }}({{ item.factoryName }})</span>
                    <span class="pull-right select-other-info">
                      {{item.typeId|formatGoodsTypeList}}<span v-show="item.typeId === '1' && item.vaccineSign">-<dict :dict-group="'vaccineSign'" :dict-key="item.vaccineSign"></dict></span>
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
          <el-col :span="6">
            <oms-form-row :isRequire="true" :span="6" label="批号">
              <el-select :remoteMethod="queryGoodsNumber('searchCondition.goodsId')" clearable filterable placeholder="请输入批号名称搜索批号"
                         remote v-model="searchCondition.batchNumber">
                <el-option :key="item.id" :label="item.batchNumber" :value="item.batchNumber"
                           v-for="item in goodsBatchNumberList"/>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="8" label="业务类型">
              <el-select filterable placeholder="请选择业务类型" v-model="searchCondition.bizType">
                <el-option :key="item.key" :label="item.label" :value="item.value" v-for="item in bizTypes"/>
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
  import MethodsMixin from '@/mixins/methodsMixin';
  import DataMixin from '@/mixins/dataMixin';

  export default {
    mixins: [MethodsMixin, DataMixin],
    data: function () {
      return {
        searchCondition: {
          goodsId: '',
          batchNumber: '',
          bizType: ''
        }
      };
    },
    methods: {
      search() {
        let {goodsId, batchNumber} = this.searchCondition;
        if (!goodsId) {
          return this.$notify.info({message: '请选择货品'});
        }
        if (!batchNumber) {
          return this.$notify.info({message: '请选择批号'});
        }
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          goodsId: '',
          batchNumber: '',
          bizType: ''
        };
        this.goodsBatchNumberList = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      },
      goodsChange(val) {
        this.searchCondition.batchNumber = '';
        this.queryGoodsNumber('searchCondition.goodsId')('');
      }
    }
  };
</script>
