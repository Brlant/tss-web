<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right" style="margin-left: 10px">
            <perm label="gs1-rule-add">
              <el-button @click="add" native-type="submit" type="primary"><i class="el-icon-t-plus"/>添加</el-button>
            </perm>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="3" label="货品">
                <el-select :clearable="true" :remote-method="queryManageGoods" @click.native.once="queryManageGoods('')" filterable
                           placeholder="请输入名称搜索货品"
                           popperClass="custom-select" remote v-model="searchWord.operateGoodsId">
                  <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in manageGoods">
                    <manage-goods-option :optionItem="item"/>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
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
          <el-col :span="6">货品名称</el-col>
          <el-col :span="4">追溯码GTIN值</el-col>
          <el-col :span="4">创建人</el-col>
          <el-col :span="4">创建时间</el-col>
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
              <el-col :span="6" class="pt">
                <span>{{ item.goodsName }}</span>
                <div>规格: {{ item.specification }}</div>
              </el-col>
              <el-col :span="4" class="pt">
                {{ item.gtin }}
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.creatorName }}</span>
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.createTime | time }}</span>
              </el-col>
              <el-col :span="3" class="opera-btn">
                <des-btn @click="editBatchNumber(item)" icon="edit" perm="gs1-rule-edit">编辑</des-btn>
                <des-btn @click="deleteBatchNumber(item)" icon="delete" perm="gs1-rule-delete">删除</des-btn>
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

    <page-right :css="{'width':'900px','padding':0}" :show="showDetailPart" @right-close="resetRightBox">
      <detail :currentItem="currentItem" :id="currentItemId" :showInfoPart="showDetailPart"
              @change="getCodeParams(pager.currentPage)" @close="resetRightBox"></detail>
    </page-right>

    <page-right :css="{'width':'800px','padding':0}" :show="showInfoPart" @right-close="resetRightBox">
      <edit-form :actionType="actionType" :currentItem="form" :id="currentItemId" @change="getCodeParams(pager.currentPage)"
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
          operateGoodsId: ''
        },
        searchWord: {
          operateGoodsId: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        form: {},
        currentItemId: '',
        currentItem: {},
        activeStatus: 0,
        actionType: ''
      };
    },
    mounted() {
      this.getCodeParams(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getCodeParams(1);
        },
        deep: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getCodeParams(1);
      },
      handleCurrentChange(val) {
        this.getCodeParams(val);
      },
      deleteBatchNumber: function (item) {
        this.$confirm(`是否删除货品"${item.goodsName}"的GS1配置?`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$http.delete('/gs1-rule/' + item.id, {}).then(() => {
            this.getCodeParams(1);
            this.$notify.success({
              title: '成功',
              message: '删除成功'
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
        this.form = {};
      },
      getCodeParams(pageNo) { // 得到批次列表
        this.batches = [];
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.$http.get('/gs1-rule', {params}).then(res => {
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
        this.getCodeParams(1);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          operateGoodsId: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
      }
    }
  };
</script>
