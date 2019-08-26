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
            <oms-col :is-show="true" :valu="''" label="完成时间"/>
            <oms-col :is-show="true" :valu="''" label="批号"/>
            <oms-col :is-show="true" :valu="''" label="业务类型"/>
            <oms-col :is-show="true" :valu="''" label="来源单位"/>
            <oms-col :is-show="true" :valu="''" label="去向单位"/>
            <oms-col :is-show="true" :valu="''" label="业务单据"/>
            <oms-col :is-show="true" :valu="''" label="质量是否合格"/>
            <oms-col :is-show="true" :valu="''" label="温度是否合格"/>
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
      statusType: Object
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
        tempList: [],
        currentIndex: -1,
        parent: this.$parent.$parent
      };
    },
    watch: {
      index(val) {
        this.currentIndex = -1;
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
