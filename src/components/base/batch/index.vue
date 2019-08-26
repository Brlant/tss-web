<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right" style="margin-left: 10px">
            <perm label="code-batch-number-add">
              <el-button @click="add" native-type="submit" type="primary"><i class="el-icon-t-plus"/>添加</el-button>
            </perm>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="5" label="生产企业">
                <org-select :list="factories" :remoteMethod="queryFactory"
                            placeholder="请输入名称搜索生产企业" v-model="searchWord.orgId"></org-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="货品">
                <el-select :clearable="true" :remote-method="queryManageGoods" @change="goodsChange" @click.native.once="queryManageGoods('')"
                           filterable placeholder="请输入名称搜索货品"
                           popperClass="custom-select" remote v-model="searchWord.goodsId">
                  <el-option :key="item.id" :label="item.name" :value="item.goodsId" v-for="item in manageGoods">
                    <manage-goods-option :optionItem="item"/>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="5" label="批号">
                <el-select :remoteMethod="queryGoodsNumber('searchWord.goodsId')" clearable filterable placeholder="请输入批号名称搜索批号"
                           remote v-model="searchWord.batchNumber">
                  <el-option :key="item.id" :label="item.batchNumber" :value="item.batchNumber"
                             v-for="item in goodsBatchNumberList"/>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <!--<el-col :span="2">-->
            <!--<oms-form-row label="附件未确认" :span="20">-->
            <!--<el-checkbox v-model="searchWord.fileFlag" @click="setFileFlag"></el-checkbox>-->
            <!--</oms-form-row>-->
            <!--</el-col>-->
            <el-col :span="6">
              <oms-form-row :span="2" label="">
                <el-button @click="searchInOrder" native-type="submit" plain type="primary">查询</el-button>
                <el-button @click="resetSearchForm" native-type="reset">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="3">货品编号</el-col>
          <el-col :span="5">货品名称</el-col>
          <el-col :span="5">生产厂商</el-col>
          <el-col :span="2">生产日期</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="3">有效期</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-if="!loadingData&&!batches.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div class="order-list-body flex-list-dom" v-else="">
          <div :class="[{'active':currentItemId===item.id}]" @click.prevent="showDetail(item)"
               class="order-list-item order-list-item-bg"
               v-for="item in batches">
            <el-row>
              <el-col :span="3" class="pt R">
                <span>{{ item.goodsCode }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.goodsName }}</span>
                <div>规格: {{ item.specification }}</div>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.orgName }}</span>
              </el-col>
              <el-col :span="2" class="pt">
                <span>{{ item.productionDate | date }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                {{ item.batchNumber }}
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.expirationDate | date }}</span>
              </el-col>
              <el-col :span="3" class="opera-btn">
                <des-btn @click="deleteBatchNumber(item)" icon="delete" perm="code-batch-number-delete">删除</des-btn>
                <des-btn @click="editBatchNumber(item)" icon="edit" perm="code-batch-number-edit"
                         v-show="!item.fileFlag">编辑
                </des-btn>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>

      <div class="text-center" v-show=" batches.length&& !loadingData">
        <el-pagination :current-page="pager.currentPage" :page-size="20"
                       :page-sizes="[20,50,100]"
                       :total="pager.count" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

    <page-right :css="{'width':'1000px','padding':0}" :show="showDetailPart" @right-close="resetRightBox">
      <detail :currentItem="currentItem" :id="currentItemId" :showInfoPart="showDetailPart"
              @change="getBatcheNumbers(pager.currentPage)" @close="resetRightBox"></detail>
    </page-right>

    <page-right :css="{'width':'1000px','padding':0}" :show="showInfoPart" @right-close="resetRightBox">
      <edit-form :actionType="actionType" :currentItem="form" :id="currentItemId" @change="getBatcheNumbers(pager.currentPage)"
                 @close="resetRightBox"></edit-form>
    </page-right>
  </div>
</template>
<script>
  import detail from './detail.vue';
  import editForm from './form/editForm.vue';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    components: {
      detail, editForm
    },
    mixins: [methodsMixin],
    data() {
      return {
        showSearch: true,
        showDetailPart: false,
        showInfoPart: false,
        loadingData: true,
        batches: [],
        filters: {
          orgId: '',
          keyWord: '',
          goodsId: '',
          fileFlag: true
        },
        searchWord: {
          orgId: '',
          keyWord: '',
          goodsId: '',
          batchNumber: '',
          fileFlag: false
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        form: {},
        currentItemId: '',
        currentItem: {},
        orgType: {
          0: {'title': '已确认', 'num': '', 'fileFlag': true},
          1: {'title': '未确认', 'num': '', 'fileFlag': false}
        },
        activeStatus: 0,
        actionType: ''
      };
    },
    mounted() {
      this.getBatcheNumbers(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getBatcheNumbers(1);
        },
        deep: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getBatcheNumbers(1);
      },
      handleCurrentChange(val) {
        this.getBatcheNumbers(val);
      },
      setFileFlag: function () {
        this.searchWord.fileFlag = !this.searchWord.fileFlag;
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.fileFlag = item.fileFlag;
      },
      deleteBatchNumber: function (item) {
        this.$confirm('警告：该操作会影响到该批号关联的数据，请慎重操作，确认要删除批号"' + item.batchNumber + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$http.delete('/dhs-batch-number/' + item.id, {}).then(() => {
            this.getBatcheNumbers(1);
            this.$notify.success({
              title: '成功',
              message: '已成功删除批号"' + item.batchNumber + '"的信息'
            });
          });
        });
      },
      editBatchNumber: function (item) {
        this.actionType = 'edit';
        this.form = Object.assign({}, item);
        this.showInfoPart = true;
      },
      add: function () {
        this.actionType = 'add';
        this.showInfoPart = true;
        this.form = {
          'batchNumber': '',
          'batchReleaseCount': '',
          'batchReleaseDate': '',
          'batchReleaseNumber': '',
          'customsFormNumber': '',
          'portInspectionNumber': '',
          'createTime': '',
          'createdBy': '',
          'expirationDate': '',
          'goodsId': '',
          'goodsName': '',
          'id': '',
          'orgId': '',
          'orgName': '',
          'productionDate': '',
          'specification': ''
        };
      },
      getBatcheNumbers(pageNo) { // 得到批次列表
        this.batches = [];
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.$http.get('/code-batchNumber', {params}).then(res => {
          this.batches = res.data.list;
          this.loadingData = false;
          this.pager.count = res.data.count;
        });
      },
      showDetail(item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.$nextTick(() => {
          this.showDetailPart = true;
        });
      },
      resetRightBox() {
        this.showDetailPart = false;
        this.showInfoPart = false;
        this.actionType = '';
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchWord);
        this.goodsBatchNumberList = [];
        this.getBatcheNumbers(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          keyWord: '',
          goodsId: '',
          batchNumber: '',
          fileFlag: false
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
      },
      goodsChange(val) {
        this.searchWord.batchNumber = '';
        this.queryGoodsNumber('searchWord.goodsId')('');
      }
    }
  };
</script>
