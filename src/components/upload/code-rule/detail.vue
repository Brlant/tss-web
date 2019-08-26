<style lang="scss" scoped="">
  .qp-box {
    margin-bottom: 40px;
    padding: 20px;
    margin-left: 40px;
    box-shadow: 4px 4px 2px 0 #ddd;
  }

  .base-pic-list {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;

    .base-pic-item {
      border: 1px solid #eee;
      position: relative;
      cursor: pointer;
      width: 180px;
      margin: 5px;
      padding: 10px;
      font-size: 12px;

      img {
        width: 180px;
        height: 180px;
        display: block;
        background: #ccc;

      }
    }
  }

  .oms-row {
    margin-bottom: 10px;
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">GS1编制结构管理</template>
    <template slot="btn">
      <el-button plain @click="close">关闭</el-button>
    </template>
    <template slot="content">
      <div>
        <form-show-part :pageSetsItem="pageSets[0]" :currentTab="currentTab">
          <template slot="content">
            <oms-row label="货品编号" :span="span">{{ batchNumber.goodsCode }}</oms-row>
            <oms-row label="货品名称" :span="span">{{ batchNumber.goodsName }}</oms-row>
            <oms-row label="货品规格" :span="span">{{ batchNumber.specification }}</oms-row>
            <oms-row label="追溯码GTIN值" :span="span">{{ batchNumber.gtin }}</oms-row>
            <oms-row label="追溯码GTIN的应用标识符（AI）" :span="span">{{ batchNumber.gtinAi }}</oms-row>
            <oms-row label="货品项目编码" :span="span">{{ batchNumber.goodsNo }}</oms-row>
            <oms-row label="货品项目编码起始位置" :span="span">{{ batchNumber.goodsNoIndex }}</oms-row>
            <oms-row label="货品项目编码长度" :span="span">{{ batchNumber.goodsNoLength }}</oms-row>
            <oms-row label="生产日期应用标识符AI" :span="span">{{ batchNumber.productionDateAi }}</oms-row>
            <oms-row label="生产日期起始位置" :span="span">{{ batchNumber.productionDateIndex }}</oms-row>
            <oms-row label="生产日期编码长度" :span="span">{{ batchNumber.productionDateLength }}</oms-row>
            <oms-row label="有效期应用标识符AI" :span="span">{{ batchNumber.effectiveDateAi }}</oms-row>
            <oms-row label="有效期编码起始位置" :span="span">{{ batchNumber.effectiveDateIndex }}</oms-row>
            <oms-row label="有效期编码长度" :span="span">{{ batchNumber.effectiveDateLength }}</oms-row>
            <oms-row label="批号应用标识符AI" :span="span">{{ batchNumber.batchNumberAi}}</oms-row>
            <oms-row label="批号编码起始位置" :span="span">{{ batchNumber.batchNumberIndex }}</oms-row>
            <oms-row label="批号编码长度" :span="span">{{ batchNumber.batchNumberLength }}</oms-row>
          </template>
        </form-show-part>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {http} from '../../../resources';
  import Util from '@/tools/utils';

  export default {
    props: ['id', 'showInfoPart'],
    data() {
      return {
        span: 10,
        pageSets: [
          {name: '基本信息', key: 0}
        ],
        currentTab: {},
        loadingData: true,
        batchNumber: {},
        Util
      };
    },
    watch: {
      showInfoPart(val) {
        if (!val) return;
        this.queryStoreDetails();
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      queryStoreDetails() {
        this.loadingData = true;
        http.get(`/gs1-rule/${this.id}`).then(res => {
          this.batchNumber = res.data;
          this.loadingData = false;
        });
      }
    }
  };
</script>
