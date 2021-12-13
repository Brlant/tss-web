<style lang="scss" scoped>
  @import "~@/assets/scss/mixins";

  $border-color: #eee;
  .bg-white {
    margin-bottom: 15px;
    padding: 15px;
    background: #fff;
  }

  .opera-btn-group {
    margin: 0;
    border: 0;
  }

  h2 {
    padding: 0;
    font-size: 18px;
    line-height: 18px;
    border-left: 5px solid $error-color;
    position: relative;
    margin: 0 0 10px;

    > span:first-child {
      position: relative;
      z-index: 3;
      background: #fff;
      padding: 0 12px;
    }
  }

  .empty-data {
    text-align: center;
    font-weight: 500;
  }

  .biz-type-list {
    display: flex;
    align-items: flex-end;

    .biz-type-item {
      background: rgba($bgColor, 0.8);
      padding: 5px 10px;
      min-width: 80px;
      border-radius: 5px;
      color: #fff;
      margin-right: 8px;
      cursor: pointer;

      &:hover, &.active {
        background: $bgColor;
      }

      &.active {
        padding: 8px 10px;
      }

      span {
        display: block;

        &.title {
          font-size: 14px;
          font-weight: normal
        }
      }
    }
  }

  .biz-type-info {
    margin-top: 15px;
    display: flex;

    > div {
      height: 100%;
      overflow: auto;
      border: 1px solid #eee;

      > h3 {
        padding: 8px 15px;
        margin: 0;
        font-size: 14px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &:first-child {
        > h3 {
          background: #f7f7f7;
        }

        .part-area-content {
          padding: 0 15px;
        }

        margin-right: 15px;
      }

      &:last-child {
        width: calc(100% - 205px);
        padding: 0 15px;
      }
    }

    .part-breadcrumb {
      padding: 8px 0;
      font-weight: bold;
    }
  }

  .biz-itm {
    &:nth-child(odd) {
      background: #ffffff;

      &:hover {
        background: #dedede
      }
    }

    &:nth-child(even) {
      background: #f7f7f7;

      &:hover {
        background: #dedede
      }
    }

    cursor: pointer;
    border-bottom: 1px solid #ebebeb;
    padding: 6px 5px;
  }

  .order-list-header {
    padding: 0 5px;
  }
</style>
<style lang="scss">
@import "~@/assets/scss/outCommon";
  .code-info {
    .el-loading-parent--relative {
      z-index: 30;
      background-color: transparent;

      .el-loading-mask {
        background-color: transparent;
        z-index: 30;
      }
    }
  }
</style>
<template>
  <div class="container code-info">
    <oms-loading v-if="loading1" :loading="loading1"></oms-loading>
    <div v-else-if="!basicInfoAndBizType.id" class="empty-info">暂无信息</div>
    <div v-else>
      <div class="bg-white">
        <h2><span>基础信息</span></h2>
        <el-row>
          <oms-col :is-show="true" label="货品" :value="basicInfoAndBizType.goodsName" :rowSpan="5"/>
          <oms-col class="R" :is-show="true" label="批号" :value="basicInfoAndBizType.batchNumber" :rowSpan="5"/>
          <oms-col :is-show="true" label="生产日期" :value="basicInfoAndBizType.productionDate | date" :rowSpan="5"/>
          <oms-col :is-show="true" label="有效期" :value="basicInfoAndBizType.expiryDate | date" :rowSpan="5"/>
          <!--<oms-col :is-show="true" label="数量" :value="basicInfoAndBizType.count+ ' '  + basicInfoAndBizType.goodsUnit"-->
          <!--:rowSpan="5"/>-->
          <oms-col :is-show="true" label="生产厂商" :value="basicInfoAndBizType.factoryName" :rowSpan="5"/>
          <oms-col :is-show="true" label="业务时间" :value="basicInfoAndBizType.startTime" :rowSpan="5">
            <span v-show="basicInfoAndBizType.startTime">{{basicInfoAndBizType.startTime | date}}~{{basicInfoAndBizType.endTime | date}}</span>
            <span v-show="!basicInfoAndBizType.startTime">无限制</span>
          </oms-col>
          <oms-col :is-show="true" label="查询创建人" :value="basicInfoAndBizType.creatorName" :rowSpan="5"/>
          <oms-col label="查询完成时间" :value="basicInfoAndBizType.completeTime | time" :rowSpan="5"/>
          <oms-col :is-show="true" label="状态" :rowSpan="5">
            <el-tag type="primary" v-show="basicInfoAndBizType.status==='0'">查询中...</el-tag>
            <el-tag type="success" v-show="basicInfoAndBizType.status==='1'">已完成</el-tag>
          </oms-col>
        </el-row>
      </div>
      <div class="bg-white" v-loading="basicInfoAndBizType.status==='0'">
        <h2><span>业务信息</span></h2>
        <div v-if="!basicInfoAndBizType.bizDataList" class="empty-info">
          {{basicInfoAndBizType.status==='0' ? '正在查询' : '暂无信息'}}
        </div>
        <div v-else>
          <div class="biz-type-list">
            <template v-for="type in basicInfoAndBizType.bizDataList">
              <div class="biz-type-item" :class="{'active':currentType.bizType===type.bizType}" @click="bizClick(type)">
                <span class="title">{{filterCodesBizType(type.bizType)}}</span>
                <span class="text-right">{{type.count + ' ' +  basicInfoAndBizType.goodsUnit}}</span>
              </div>
            </template>
          </div>
          <oms-loading v-if="loading2" :loading="loading2"></oms-loading>
          <div v-else-if="!trees.length" class="empty-info">{{basicInfoAndBizType.status==='0' ? '正在查询' : '暂无信息'}}</div>
          <div v-else class="biz-type-info">
            <div class="part-area">
              <h3 v-if="currentType">
                <div>去向分布</div>
              </h3>
              <div :style="'maxHeight:800px'">
                <div class="part-area-content">
                  <class-tree ref="regionTree" :treeData="trees" active="1"
                              @treeClick="treeClick" :queryChildrenNode="queryChildrenNode"></class-tree>

                </div>
              </div>
            </div>
            <div class="part-detail">
              <div class="part-breadcrumb" v-if="currentNode.id">
                <span>{{filterCodesBizType(currentType.bizType) + ' - '}}{{currentNode.labelAll.join(' - ')}}
                  （{{currentNode.count
                  + basicInfoAndBizType.goodsUnit}}）</span>
              </div>
              <div class="order-list">
                <el-row class="order-list-header">
                  <template v-if="!isPov">
                    <el-col :span="3">订单号</el-col>
                    <el-col :span="5">来源单位</el-col>
                    <el-col :span="5">去向单位</el-col>
                    <el-col :span="5">操作单位</el-col>
                    <el-col :span="4">业务时间</el-col>
                    <el-col :span="2">数量（{{basicInfoAndBizType.goodsUnit}}）</el-col>
                  </template>
                  <template v-else>
                    <el-col :span="16">接种单位</el-col>
                    <el-col :span="8">数量（{{basicInfoAndBizType.goodsUnit}}）</el-col>
                  </template>
                </el-row>
                <el-row v-if="loading3">
                  <el-col :span="24">
                    <oms-loading :loading="loading3"></oms-loading>
                  </el-col>
                </el-row>
                <el-row v-else-if="!bizList.length">
                  <el-col :span="24">
                    <div class="empty-info">暂无信息</div>
                  </el-col>
                </el-row>
                <el-row class="biz-itm" v-for="item in bizList" :key="item.id" @click.native="showItem(item)">
                  <template v-if="!isPov">
                    <el-col :span="3" class="R">{{item.orderNo}}</el-col>
                    <el-col :span="5">{{item.sourceOrgName}}</el-col>
                    <el-col :span="5">{{item.directionOrgName}}</el-col>
                    <el-col :span="5">{{item.operateOrgName}}</el-col>
                    <el-col :span="4">{{item.time | time}}</el-col>
                    <el-col :span="2">{{item.count}}</el-col>
                  </template>
                  <template v-else>
                    <el-col :span="16">{{item.directionOrgName}}</el-col>
                    <el-col :span="8">{{item.count}}</el-col>
                  </template>
                </el-row>
                <div class="text-center mt-10" v-show="bizList.length">
                  <el-pagination @size-change="sizeChange" @current-change="currentChange"
                                 :current-page="pager.currentPage"
                                 :page-sizes="[20,50,100]" :page-size="20" layout="sizes, prev, pager, next, jumper"
                                 :total="pager.count">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0,top: 0}" :show="showDetail" @right-close="resetRightBox"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :filterBizType="filterBizType" :orderId="currentOrderId" @close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from '../search';
  import CommonMixin from '@/mixins/commonMixin';
  import DataMixin from '@/mixins/dataMixin';
  import ClassTree from '@/components/common/classTree.vue';
  import utils from '@/tools/utils';
  import showForm from '@/components/outsite/search/business/form/show.form.vue';

  export default {
    components: {
      ClassTree,
      SearchPart,
      showForm
    },
    mixins: [CommonMixin, DataMixin],
    data() {
      return {
        activeNames: '',
        currentType: {},
        currentNode: {},
        basicInfoAndBizType: {},
        trees: [],
        bizList: [],
        loading1: false,
        loading2: false,
        loading3: false,
        currentOrderId: '',
        showDetail: false
      };
    },
    computed: {
      typeInfoBoxHeight() {
        return (this.$store.state.windowSize.height - 390);
      },
      isPov() {
        return this.currentType.bizType === '3-0';
      }
    },
    mounted() {
      this.queryBasicInfoAndBizTypes();
    },
    methods: {
      resetRightBox() {
        this.showDetail = false;
      },
      showItem(order) {
        if (!order.codeBizLogId) return;
        this.currentOrderId = order.codeBizLogId;
        this.showDetail = true;
      },
      queryBasicInfoAndBizTypes(isLoading) {
        typeof isLoading !== 'boolean' && (this.basicInfoAndBizType = {});
        let id = this.$route.params.id;
        if (!id) return;
        this.loading1 = typeof isLoading === 'boolean' ? isLoading : true;
        this.$http.get(`/code-biz/batch-task/${id}`).then(res => {
          this.basicInfoAndBizType = res.data;
          this.loading1 = false;
          if (res.data.status === '1') {
            if (res.data.bizDataList.length) this.bizClick(res.data.bizDataList[0]);
            return;
          }
          setTimeout(() => {
            this.queryBasicInfoAndBizTypes(false);
          }, 1000);
        });
      },
      queryLeftTree() {
        this.trees = [];
        let id = this.currentType.id;
        if (!id) return;
        this.loading2 = true;
        this.$http.get(`/code-biz/batch-task/${id}/tree`).then(res => {
          this.trees = this.formatTrees(res.data);
          this.loading2 = false;
          this.$nextTick(() => {
            let regionTree = this.$refs.regionTree;
            if (!regionTree) return;
            this.trees.length && regionTree.clickHandler(this.trees[0]);
            this.trees.length === 1 && regionTree.changeCollapse(this.trees[0]);
          });
        });
      },
      formatTrees(list) {
        if (!list.length) return null;
        return this.recursionLazyList(list);
      },
      // 异步加载节点
      recursionLazyList(list) {
        let {getTreeLazyNode} = this;
        return list.filter(f => f.level === 1).map(m => getTreeLazyNode(m));
      },
      queryChildrenNode(item) {
        let {getTreeLazyNode} = this;
        item.loading = true;
        this.$http.get(`/code-biz/batch-task/${item.id}/tree`).then(res => {
          item.children = res.data.map(m => getTreeLazyNode(m));
          item.isLeaf = !item.children.length;
          item.open = !item.open;
          item.loading = false;
          item.children.length === 1 && this.$refs.regionTree.changeCollapse(item.children[0]);
        });
      },
      getTreeLazyNode(m) {
        let tltAry = utils.formatLabelByAddress(m.level, m.provinceCode, m.cityCode, m.areaCode);
        return {
          id: m.id,
          label: tltAry[m.level - 1],
          labelAll: tltAry,
          count: m.count,
          value: m.level === 1 ? m.provinceCode : m.level === 2 ? m.cityCode : m.level === 3 ? m.areaCode : '',
          children: [],
          open: false,
          loading: false,
          isLeaf: false
        };
      },
      // 一次加载所有节点
      recursionList(list, node) {
        let {getTreeNode} = this;
        if (!node) return list.filter(f => f.level === 2).map(m => getTreeNode(list, m));
        return list.filter(f => f.parentId === node.id).map(m => getTreeNode(list, m));
      },
      getTreeNode(list, m) {
        let tltAry = utils.formatLabelByAddress(m.level, m.provinceCode, m.cityCode, m.areaCode);
        return {
          id: m.id,
          label: tltAry[m.level - 1],
          labelAll: tltAry,
          count: m.count,
          value: m.level === 1 ? m.provinceCode : m.level === 2 ? m.cityCode : m.level === 3 ? m.areaCode : '',
          children: this.recursionList(list, m)
        };
      },
      queryRightList(pageNo) {
        this.bizList = [];
        let id = this.currentNode.id;
        if (!id) return;
        this.pager.currentPage = pageNo;
        let params = {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        };
        this.loading3 = true;
        this.$http.get(`/code-biz/batch-task/${id}/detail`, {params}).then(res => {
          this.bizList = res.data.list;
          this.pager.count = res.data.count;
          this.loading3 = false;
        });
      },
      bizClick(type) {
        this.currentType = type;
        this.queryLeftTree(1);
      },
      treeClick(item) {
        this.currentNode = item;
        this.queryRightList(1);
      },
      sizeChange(val) {
        this.pager.pageSize = val;
        this.queryRightList(1);
      },
      currentChange(val) {
        this.queryRightList(val);
      }
    }
  };
</script>
