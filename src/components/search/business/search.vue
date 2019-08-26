<template>
  <div :class="{up:!showSearch}" class="opera-btn-group">
    <div class="opera-icon">
        <span class="pull-right" style="margin-left: 10px">
          <perm class="pull-right" label="biz-codes-file-upload">
              <el-button @click="add" native-type="submit" type="primary"><i class="el-icon-t-plus"/>添加</el-button>
          </perm>
        </span>
    </div>
    <el-form class="advanced-query-form" onsubmit="return false">
      <el-row>
        <!--<el-col :span="8">-->
        <!--<oms-form-row label="上报时间" :span="5">-->
        <!--<el-date-picker class="el-date-picker&#45;&#45;mini" v-model="times2" type="datetimerange" placeholder="请选择"/>-->
        <!--</oms-form-row>-->
        <!--</el-col>-->
        <el-col :span="9">
          <oms-form-row :span="5" label="业务时间">
            <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                            type="datetimerange" v-model="times1"/>
          </oms-form-row>
        </el-col>
        <!--<el-col :span="8">-->
        <!--<oms-form-row label="上传单位" :span="5">-->
        <!--<org-select v-model="searchCondition.uploadOrg" :list="allOrgList" @change="orgChange"-->
        <!--:remoteMethod="queryAllFactory" placeholder="请输入名称搜索上传单位"></org-select>-->
        <!--</oms-form-row>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
        <!--<oms-form-row label="上传人" :span="8">-->
        <!--<el-select placeholder="请选择上传人" v-model="searchCondition.createdBy"-->
        <!--filterable clearable remote :remote-method="queryOrgAccountList('searchCondition.org')">-->
        <!--<el-option :label="item.name" :value="item.id" :key="item.id"-->
        <!--v-for="item in orgUsers"></el-option>-->
        <!--</el-select>-->
        <!--</oms-form-row>-->
        <!--</el-col>-->
        <el-col :span="15">
          <oms-form-row :span="2" label="">
            <el-button @click="search" plain type="primary">查询</el-button>
            <el-button @click="reset" native-type="reset">重置</el-button>
          </oms-form-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          operateStartTime: '',
          operateEndTime: '',
          // uploadStartTime: '',
          // uploadEndTime: '',
          uploadOrg: '',
          createdBy: ''
        },
        showSearch: false,
        list: [],
        times1: [],
        times2: []
      };
    },
    methods: {
      search() {
        this.searchCondition.operateStartTime = this.formatTimeAry(this.times1, 0);
        this.searchCondition.operateEndTime = this.formatTimeAry(this.times1, 1);
        // this.searchCondition.uploadStartTime = parent.formatTimeAry(this.times2, 0);
        // this.searchCondition.uploadEndTime = parent.formatTimeAry(this.times2, 1);
        this.$emit('search', this.searchCondition);
      },
      formatTimeAry(times, index, str) {
        if (!times) return;
        return this.formatTime(times[index], str);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      reset() {
        this.searchCondition = {
          operateStartTime: '',
          operateEndTime: '',
          // uploadStartTime: '',
          // uploadEndTime: '',
          createdBy: '',
          uploadOrg: ''
        };
        this.times1 = [];
        this.$emit('search', this.searchCondition);
      },
      orgChange(val) {
        this.searchCondition.createdBy = '';
        this.queryOrgAccountList('searchCondition.uploadOrg')();
        this.orgUsers = [];
      },
      isShow(val) {
        this.showSearch = val;
      },
      add() {
        this.$emit('add');
      }
    }
  };
</script>
