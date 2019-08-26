<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">上传文件类型</el-col>
        <el-col :span="5">上传时间</el-col>
        <el-col :span="7">上传单位</el-col>
        <el-col :span="6">操作人</el-col>
        <el-col :span="3">上传状态</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length === 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[{'active':currentItemId===item.id}]" @click="showDetail(item)"
             class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="3">{{objectType[item.objectType]}}</el-col>
            <el-col :span="5">{{item.createTime | time}}</el-col>
            <el-col :span="7">{{item.orgName}}</el-col>
            <el-col :span="6">{{item.creatorName}}</el-col>
            <el-col :span="3">
              <el-tag type="warning" v-if="!item.status">解析中</el-tag>
              <el-tag type="success" v-else-if="item.status === '1'">正常</el-tag>
              <el-tag type="danger" v-else="item.status !== '1'">异常</el-tag>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="20"
                     :page-sizes="[20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <page-right :css="{'width':'1100px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :currentItem="currentItem" :detailId="currentItemId" :filterBizType="filterBizType" :is="currentPart"
                 :isLog="true" :orderId="currentItemId" :showDetail="showIndex !== -1"
                 @close="resetRightBox"/>
      <!--<detail :detailId="currentId" :currentItem="currentItem" @close="resetRightBox"/>-->
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import DataMixin from '@/mixins/dataMixin';
  import {UploadLog} from '@/resources';
  import detail from '../import/detail/detail.vue';
  import exceptionDetail from '../exception-code/detail/detail.vue';
  import BizDetail from '@/components/search/business/form/show.form';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin, DataMixin],
    data() {
      return {
        filters: {},
        objectType: {
          FACTORY_INIT: '源文件',
          FACTORY_EXCEPTION: '异常码文件',
          FACTORY_BIZ: '业务追溯文件'
        }
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.init();
      this.queryList(1);
    },
    methods: {
      init() {
        this.dialogComponents = {
          0: detail,
          1: exceptionDetail,
          2: BizDetail
        };
        // 可以发链接给别人
        let id = this.$route.params.id;
        if (id !== 'id') {
          this.showDetail({objectId: id, objectType: this.$route.query.objectType});
        }
      },
      resetRightBox() {
        this.$router.push('/system/upload/log/id');
        this.defaultPageRight.width = '700px';
        this.showIndex = -1;
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      queryList(pageNo) {
        const http = UploadLog.query;
        const params = this.queryUtil(http, pageNo);
      },
      showDetail(item) {
        if (item.objectType === 'FACTORY_INIT') {
          this.currentPart = this.dialogComponents[0];
          this.$http.get(`/code-source/${item.objectId}`).then(res => {
            this.currentItem = Object.assign({}, res.data, {creatorName: this.currentItem.creatorName});
          });
        } else if (item.objectType === 'FACTORY_EXCEPTION') {
          this.currentPart = this.dialogComponents[1];
          this.$http.get(`/code-exception/${item.objectId}`).then(res => {
            this.currentItem = res.data;
          });
        } else {
          this.currentPart = this.dialogComponents[2];
        }
        this.showIndex = 0;
        this.$nextTick(() => {
          this.currentItemId = item.objectId;
          this.currentItem = item;
          this.$router.push({path: `/system/upload/log/${this.currentItemId}`, query: {objectType: item.objectType}});
        });
      }
    }
  };
</script>
