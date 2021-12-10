<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">业务信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!formItem.id">暂无数据</div>
      <div v-else>
        <form-show-part :currentTab="currentTab" :pageSetsItem="pageSets[0]">
          <div slot="content">
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.bizTime | time" label="业务时间"/>
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.goodsName" label="货品"/>
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.batchNumber" class="R" label="批号"/>
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.productionDate | date" label="生产日期"/>
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.expiryDate | date" label="有效期"/>
            <oms-col :is-show="true" :rowSpan="5" :value="filterBizType(formItem.bizType)" label="业务类型"/>
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.sourceOrgName" label="来源单位"/>
            <oms-col :is-show="true" :rowSpan="5" :value="formItem.directionOrgName" label="去向单位"/>

            <oms-col :is-show="true" :rowSpan="5" :value="formItem.count" label="数量"/>
          </div>
        </form-show-part>
        <form-show-part :currentTab="currentTab" :pageSetsItem="pageSets[1]">
          <relevance-code :current-order="formItem" :index="currentIndex" slot="content"/>
        </form-show-part>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import FormShowPart from '@/components/common/form-show-part';
  import relevanceCode from '@/components/common/order/relevance.code';

  export default {
    components: {FormShowPart, relevanceCode},
    props: {
      index: Number,
      formItem: Object,
      type: Number,
      statusType: Object,
      filterBizType: Function
    },
    data() {
      return {
        span: 6,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '追溯码信息', key: 1}
        ],
        currentTab: {},
        detailInfo: [],
        currentIndex: -1,
        parent: this.$parent.$parent
      };
    },
    watch: {
      index(val) {
        this.currentIndex = -1;
        if (val !== 1) return;
        this.$nextTick(() => {
          this.currentIndex = 2;
        });
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      }
    }
  };
</script>
