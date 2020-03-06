<template>
  <div :class="{up:!showSearch}" class="opera-btn-group">
    <!--    <div class="opera-icon">-->
    <!--      <div class="pull-right">-->
    <!--        <perm class="mr-10" label="exception-codes-goods-upload">-->
    <!--          <el-button @click="batchNumberAdd" type="primary"><i class="el-icon-upload2"/>上报批号</el-button>-->
    <!--        </perm>-->
    <!--        <perm label="exception-codes-file-upload">-->
    <!--          <el-button @click="add" native-type="submit" type="primary"><i class="el-icon-upload2"/>上传文件</el-button>-->
    <!--        </perm>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-form class="advanced-query-form" onsubmit="return false">
      <el-row>
        <!--<el-col :span="8">-->
        <!--<oms-form-row label="上报时间" :span="5">-->
        <!--<el-date-picker class="el-date-picker&#45;&#45;mini" v-model="times2" type="datetimerange" placeholder="请选择"/>-->
        <!--</oms-form-row>-->
        <!--</el-col>-->
        <el-col :span="8">
          <oms-form-row label="上传单位" :span="8" isRequire >
            <el-select filterable placeholder="请输入名称搜上传单位"
                       :clearable="true" v-model="searchCondition.objectOrgId"
                       popperClass="good-selects" remote :remote-method="queryPermDownAllFactory">
              <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in downOrgList">
                <div style="overflow: hidden">
                  <span class="pull-left" style="clear: right">{{org.name}}</span>
                </div>
                <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                </div>
              </el-option>
            </el-select>
          </oms-form-row>
        </el-col>

        <el-col :span="8">
          <oms-form-row :span="5" label="发生时间">
            <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                            type="datetimerange" v-model="times1"/>
          </oms-form-row>
        </el-col>
        <!--<el-col :span="7">-->
        <!--<oms-form-row label="上报单位" :span="5">-->
        <!--<org-select v-model="searchCondition.uploadOrg" :list="allOrgList" @change="orgChange"-->
        <!--:remoteMethod="queryAllFactory" placeholder="请输入名称搜索上报单位"></org-select>-->
        <!--</oms-form-row>-->
        <!--</el-col>-->
        <el-col :span="8">
          <oms-form-row :span="8" label="上报人">
            <el-input v-model="searchCondition.createdBy" clearable placeholder="请输入上报人"></el-input>
          </oms-form-row>
        </el-col>
      </el-row>
      <el-row class="mt-10">
        <el-col :span="11">
          <oms-form-row :span="5" label="">
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
          startTime: '',
          endTime: '',
          // uploadStartTime: '',
          // uploadEndTime: '',
          createdBy: '',
          objectOrgId: '',
          uploadOrg: ''
        },
        showSearch: false,
        list: [],
        times1: [],
        times2: []
      };
    },
    mounted() {

    },
    methods: {
      search() {
        this.searchCondition.startTime = this.formatTimeAry(this.times1, 0);
        this.searchCondition.endTime = this.formatTimeAry(this.times1, 1);
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
          startTime: '',
          endTime: '',
          // uploadStartTime: '',
          // uploadEndTime: '',
          createdBy: '',
          objectOrgId: '',
          uploadOrg: '',
        };
        this.times1 = [];
        this.$emit('clear', this.searchCondition);
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
      },
      batchNumberAdd() {
        this.$emit('batchNumberAdd');
      }
    }
  };
</script>
