<style lang="scss" scoped>
  @import "../../../assets/scss/mixins";

  $border-color: #eee;
  .bg-white {
    margin-bottom: 20px;
    padding: 15px;
    background: #fff;
  }

  .main-info-dom {
    font-size: 14px;
  }

  .oms-row {
    margin-bottom: 7px;
  }

  .list-flex {
    display: flex;
    /*justify-content: space-between;*/
    .list-box {
      font-size: 12px;
      width: 32%;
      margin-right: 1.2%;
      background: #eee;

      .body {
        padding: 10px 15px;

        .oms-row {
          margin-bottom: 7px;
          align-items: center;
        }

        .label {
          color: $info-color;
          margin: 5px 0;
        }
      }

      h3 {
        font-size: 14px;
        margin: 0;
        padding: 10px;
        background: $error-color;
        color: #fff;
        display: flex;
        align-items: center;
        font-weight: normal;

        i {
          margin-right: 7px;
          font-size: 24px;
        }
      }

      &:nth-child(2) {
        h3 {
          background: $warning-color
        }
      }

      &:nth-child(3) {
        h3 {
          background: $success-color
        }
      }

      &:nth-child(4) {
        h3 {
          background: $selected-color
        }
      }

      h4 {
        margin: 0;
        padding: 7px 0 7px 4px;
      }
    }
  }

  .list_log {
    .list_item {
      clear: both;

      .ml5 {
        margin-left: 5px;
      }
    }
  }

  .color_date {
    color: #999;
  }

  .search-row {
    align-items: center;

    > div {
      white-space: nowrap;
    }
  }

  h2 {
    padding: 0;
    font-size: 18px;
    line-height: 24px;
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

  .flow-double-bar {
    width: 100%;
    padding: 0;
    display: table;
    border-top: 20px solid #f9f9f9;
    /*border-bottom: 20px solid #f9f9f9;*/
    > div {
      overflow: auto;
      display: table-cell;

      &:first-child {
        /*background: #fff;*/
        width: 500px;
        text-align: center;

        .info-item {
          margin: 10px 10px;
          padding: 5px;
          line-height: 22px;
          cursor: pointer;
          border-radius: 4px;
          border: 1px solid $border-color;

          &.error {
            color: $error-color;
            border-color: $error-color;
          }

          /*&:hover {*/
          /*background: #f1f1f1*/
          /*}*/
          .time {
            font-size: 12px;
          }
        }

        h3 {
          font-size: 14px;
          padding: 0;
          margin: 0;
        }
      }

      &:last-child {
        width: calc(100% - 500px);
        background: #fff;
        border-left: 15px solid #f9f9f9;

        &.info-item {
          padding: 15px;
          margin: 0 0 0 15px;
          background: #eee0;

          h3 {
            margin: 0;
            padding: 0;
            border-left: 5px solid $error-color;

            > span {
              padding-left: 12px;
            }
          }

          &.open {
            background: #fff;
            /*margin: 5px;*/
            border-radius: 0;
          }

          .oms-row {
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  .no-rights-tooltip {
    text-align: center;
    font-size: 16px;
  }

  .title {
    margin: 0 0 10px 0;
    padding-left: 10px;
  }
</style>
<style lang="scss">
  @import "../../../assets/scss/mixins";

  .timeLine__code {
    margin-left: 80px;
    margin-top: 20px;

    .tiny-timeline-item-left {
      position: absolute;
      left: 15px;
      top: 4px;
      transform: translateY(-50%);
    }

    .tiny-timeline-item-head-custom {
      min-width: 32px;
      min-height: 32px;
      text-align: center;
      line-height: 1;
      border-radius: 50%;
      font-size: 16px;
      position: absolute;
      left: 143px;
      transform: translateY(-50%);
      cursor: pointer;

      i.iconfont {
        line-height: 30px;
        font-size: 24px;
        color: #333;

        &.active {
          color: $error-color;
        }

        &.el-icon-error {
          margin-top: 1px;
        }
      }
    }

    .tiny-timeline-item-end {
      height: 33px;

      .tiny-timeline-item-end-custom {
        border-radius: 0;
        background-color: transparent;
        text-align: center;
        position: absolute;
        left: 142px;
        transform: translateY(-50%);

        .el-icon-caret-bottom {
          line-height: 32px;
          font-size: 28px;

          &.active {
            color: $error-color;
          }
        }
      }
    }

    .tiny-timeline-item-head-default {
      border-color: #333;
      color: #333;

      &.active {
        border-color: $error-color;
        color: $error-color;
      }
    }

    .tiny-timeline-item-tail {
      height: 100%;
      border-left: 2px solid #333;
      position: absolute;
      left: 159px;
      top: 0;

      .tiny-timeline--arrow {
        position: absolute;
        bottom: 14px;
        left: 50%;
        transform: translateX(-9px);
        font-size: 16px;
      }
    }

    .tiny-timeline-item-content {
      padding-left: 20px;
      text-align: left;
      left: 170px;
      top: -8px;
      width: 120px;
      cursor: pointer;

      .title {
        font-size: 16px;
        font-weight: bold;

        &.active {
          color: $activeColor;
        }
      }
    }

    .tiny-timeline-item {
      padding: 0 0 30px 0;
    }
  }

  .el-collapse--code {
    .el-collapse-item__header {
      padding-left: 10px;
    }

    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
</style>
<template>
  <div class="container">
    <div class="bg-white">
      <el-form @submit.native.prevent>
        <el-row type="flex" :gutter="20" class="search-row">
          <el-col :span="16">
            <el-input v-model="currentCodeId" @keyup.native.enter="getCodeInfo" placeholder="请输入追溯码"></el-input>
          </el-col>
          <el-col>
            <el-button type="primary" @click="getCodeInfo" plain>查询</el-button>
            <el-button type="default" nativeType="reset" @click="resetCode">重置</el-button>
            <perm label="code-trace-json-download" class="ml-10">
              <el-button type="success" plain @click="downloadJson" v-show="details.length">下载json数据</el-button>
            </perm>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="!details.length" class="empty-info empty-info--loading" v-loading="loading">
      无追溯码信息
    </div>
    <template v-else-if="details.length === 1">
      <div v-for="(detail, index) in details" :key="index">
        <div class="bg-white">
          <h2>
            <span>基础信息</span>
            <el-tag :type="formatStatus(detail).isDanger ? 'danger' : detail.status === '0' ? 'warning' : 'success'">
              {{formatStatus(detail).title}}
            </el-tag>
          </h2>
          <el-row :gutter="12" class="main-info-dom">
            <el-col :span="12">
              <oms-row label="追溯码" :span="labelSpan" class="R">{{ detail.code }}</oms-row>
              <oms-row label="品名" :span="labelSpan" v-show="detail.goodsName">{{ detail.goodsName }}</oms-row>
              <oms-row label="规格" :span="labelSpan" v-show="detail.specification">{{ detail.specification }}</oms-row>
              <oms-row label="厂商" :span="labelSpan" v-show="detail.factoryName ">{{ detail.factoryName }}</oms-row>
              <oms-row label="质量状态" :span="labelSpan">
                <el-tag type="success" v-if="detail.qualityFlag">合格</el-tag>
                <el-tag type="primary" v-if="!detail.qualityFlag">不合格</el-tag>
              </oms-row>
              <oms-row label="父级包装码" :span="labelSpan" v-show="detail.parentCode">{{detail.parentCode}}</oms-row>
            </el-col>
            <el-col :span="12">
              <oms-row label="包装层级" :span="labelSpan" v-show="detail.packageScheme">{{ packageType[detail.packageScheme
                - 1] }}
              </oms-row>
              <oms-row class="R" label="批号" :span="labelSpan" v-show="detail.batchNumber">{{ detail.batchNumber }}
              </oms-row>
              <oms-row label="生产日期" :span="labelSpan" v-show="detail.productionDate">{{ detail.productionDate | date}}
              </oms-row>
              <oms-row label="有效期" :span="labelSpan" v-show="detail.expirationDate">{{ detail.expirationDate | date }}
              </oms-row>
              <oms-row label="通关单号" :span="labelSpan" v-show="detail.customsFormNumber">
                {{detail.customsFormNumber}}
                <el-tag type="success" v-if="detail.qualityFlag">已通关</el-tag>
              </oms-row>
            </el-col>
          </el-row>
        </div>
        <div class="flow-double-bar" v-if="detail.dtoList.length">
          <div class="bg-white">
            <h2 class="text-left"><span>业务追溯</span></h2>
            <ul class="timeLine__code tiny-timeline">
              <li class="tiny-timeline-item tiny-timeline-item-end" v-for="(info,index) in detail.dtoList">
                <div class="tiny-timeline-item-left">
                  <span>{{info.time | minute}}</span>
                </div>
                <div class="tiny-timeline-item-tail">
                  <i class="el-icon-caret-bottom tiny-timeline--arrow"></i>
                </div>
                <div class="tiny-timeline-item-head tiny-timeline-item-head-custom tiny-timeline-item-head-default"
                     :class="{active: index === detail.activeId}" @click.stop="changeOpen(detail, index)">
                  <i class="iconfont oms-font"
                     :class="[(info.bizType !== '4-0' ? 'el-icon-t-' : 'el-icon-') +
                 filterCodesIcon(info.bizType), {active: index === detail.activeId}]"></i>
                </div>
                <div class="tiny-timeline-item-content" @click.stop="changeOpen(detail, index)">
                <span class="title" :class="{active: index === detail.activeId}">
                    <span v-if="info.bizType !== '4-0'">{{filterCodesBizType(info.bizType)}}</span>
                   <dict v-else dict-group="codeExceptionType" :dict-key="info.exceptionType"></dict>
                   <perm label="code-trace-log-delete" class="ml-15" v-show="index === detail.activeId">
                    <i class="el-icon-delete" style="color: red;cursor: pointer" @click.stop="deleteItem(info)"></i>
                  </perm>
                </span>
                </div>
              </li>
            </ul>
          </div>
          <div v-for="(info) in detail.dtoList.filter((f, index) => index === detail.activeId)" class="info-item open">
            <h2>
              <span>{{filterCodesBizType(info.bizType)}}</span>
            </h2>
            <el-tabs v-model="showType" size="mini" type="card" v-show="info.logisticsDetailDtos && info.logisticsDetailDtos.length">
              <el-tab-pane label="业务信息" name="1"></el-tab-pane>
              <el-tab-pane label="物流信息" name="2"></el-tab-pane>
            </el-tabs>
            <div>
              <el-row v-if="info.canWatch">
                <div v-show="showType === '1'">
                  <div v-if="info.bizType === '4-0'">
                    <oms-row label='异常类型' :span="4">
                      <dict dict-group="codeExceptionType" :dict-key="info.exceptionType"></dict>
                    </oms-row>
                    <oms-row label='上报单位' :span="4" v-show="info.uploadOrg">{{info.uploadOrg}}</oms-row>
                    <oms-row label='上报人' :span="4" v-show="info.uploadMan">{{info.uploadMan}}</oms-row>
                    <oms-row label='上报时间' :span="4" v-show="info.handoverTime">{{info.handoverTime | time}}</oms-row>
                  </div>
                  <div v-else-if="info.bizType === '3-0'">
                    <oms-row label='零售/使用单位' :span="5" v-show="info.orgName">{{info.orgName}}</oms-row>
                    <oms-row label='零售/使用时间' :span="5" v-show="info.time">{{info.time | time}}</oms-row>
                  </div>
                  <div v-else>
                    <oms-row label='订单号' :span="4" v-show="info.orderNo">{{info.orderNo}}</oms-row>
                    <oms-row label='上游单位' :span="4" v-show="info.orgName">{{info.orgName}}</oms-row>
                    <oms-row label='下游单位' :span="4"
                             v-show="(info.bizType !== '1-3' || info.bizType !== '2-3') && info.directionOrgName ">
                      {{info.directionOrgName}}
                    </oms-row>
                    <oms-row label='物流方式' :span="4" v-show="info.transportationMeans">
                      <!--<dict :dict-group="info.bizType.indexOf('1') === '0' ? 'transportationMeans' : 'outTransportMeans'"-->
                      <!--:dict-key="info.transportationMeans"></dict>-->
                      {{info.transportationMeans}}
                    </oms-row>
                    <oms-row label='运输条件' :span="4" v-show="info.logisticsMode">
                      <!--<dict dict-group="transportationCondition"-->
                      <!--:dict-key="info.logisticsMode"></dict>-->
                      {{info.logisticsMode}}
                    </oms-row>
                    <oms-row label='温度是否合格' :span="4" v-show="typeof info.temperatureFlag === 'boolean'">
                      <span v-show="info.temperatureFlag">合格</span>
                      <span v-show="!info.temperatureFlag">不合格</span>
                    </oms-row>
                    <oms-row label='操作单位' :span="4" v-show="info.systemOrg">{{info.systemOrg}}</oms-row>
                    <oms-row label='签收时间' :span="4" v-show="info.handoverTime">{{info.handoverTime | time}}</oms-row>
                    <oms-row label='签收人' :span="4" v-show="info.handoverPerson">{{info.handoverPerson}}</oms-row>
                    <oms-row label='签收单位' :span="4" v-show="info.handoverOrg">{{info.handoverOrg}}</oms-row>
                    <oms-row label='操作层级' :span="4">{{info.operateScheme}}级包装</oms-row>
                  </div>
                </div>
                <div v-if="showType === '2'">
                  <el-table :data="info.logisticsDetailDtos" style="width: 100%" class="mt-10 header-list">
                    <el-table-column prop="operatorName" label="操作人" min-width="100"/>
                    <el-table-column prop="address" label="地址" min-width="150"/>
                    <el-table-column prop="time" label="处理时间" min-width="140">
                      <span slot-scope="scope">{{scope.row.time | time}}</span>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注信息" min-width="150"/>
                  </el-table>
                  <waybill-info :current-order="info"/>
                </div>
              </el-row>
              <el-row v-else class="no-rights-tooltip">无权查看</el-row>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <el-collapse class="el-collapse--code" v-model="activeId">
        <el-collapse-item :key="index" :name="index" :title="`${detail.goodsName}（${detail.factoryName}）`"
                          v-for="(detail, index) in details">
          <div class="bg-white">
            <h2>
              <span>基础信息</span>
              <el-tag :type="formatStatus(detail).isDanger ? 'danger' : detail.status === '0' ? 'warning' : 'success'">
                {{formatStatus(detail).title}}
              </el-tag>
            </h2>
            <el-row :gutter="12" class="main-info-dom">
              <el-col :span="12">
                <oms-row label="追溯码" :span="labelSpan" class="R">{{ detail.code }}</oms-row>
                <oms-row label="品名" :span="labelSpan" v-show="detail.goodsName">{{ detail.goodsName }}</oms-row>
                <oms-row label="规格" :span="labelSpan" v-show="detail.specification">{{ detail.specification }}</oms-row>
                <oms-row label="厂商" :span="labelSpan" v-show="detail.factoryName ">{{ detail.factoryName }}</oms-row>
                <oms-row label="质量状态" :span="labelSpan">
                  <el-tag type="success" v-if="detail.qualityFlag">合格</el-tag>
                  <el-tag type="primary" v-if="!detail.qualityFlag">不合格</el-tag>
                </oms-row>
                <oms-row label="父级包装码" :span="labelSpan" v-show="detail.parentCode">{{detail.parentCode}}</oms-row>
              </el-col>
              <el-col :span="12">
                <oms-row label="包装层级" :span="labelSpan" v-show="detail.packageScheme">{{
                  packageType[detail.packageScheme - 1] }}
                </oms-row>
                <oms-row class="R" label="批号" :span="labelSpan" v-show="detail.batchNumber">{{ detail.batchNumber }}
                </oms-row>
                <oms-row label="生产日期" :span="labelSpan" v-show="detail.productionDate">{{ detail.productionDate |
                  date}}
                </oms-row>
                <oms-row label="有效期" :span="labelSpan" v-show="detail.expirationDate">{{ detail.expirationDate | date
                  }}
                </oms-row>
                <oms-row label="通关单号" :span="labelSpan" v-show="detail.customsFormNumber">
                  {{detail.customsFormNumber}}
                  <el-tag type="success" v-if="detail.qualityFlag">已通关</el-tag>
                </oms-row>
              </el-col>
            </el-row>
          </div>
          <div class="flow-double-bar" v-if="detail.dtoList.length">
            <div class="bg-white">
              <h2 class="text-left"><span>业务追溯</span></h2>
              <ul class="timeLine__code tiny-timeline">
                <li class="tiny-timeline-item tiny-timeline-item-end" v-for="(info,index) in detail.dtoList">
                  <div class="tiny-timeline-item-left">
                    <span>{{info.time | minute}}</span>
                  </div>
                  <div class="tiny-timeline-item-tail">
                    <i class="el-icon-caret-bottom tiny-timeline--arrow"></i>
                  </div>
                  <div class="tiny-timeline-item-head tiny-timeline-item-head-custom tiny-timeline-item-head-default"
                       :class="{active: index === detail.activeId}" @click.stop="changeOpen(detail, index)">
                    <i class="iconfont oms-font"
                       :class="[(info.bizType !== '4-0' ? 'oms-font el-icon-t-' : 'el-icon-') +
                 filterCodesIcon(info.bizType), {active: index === detail.activeId}]"></i>
                  </div>
                  <div class="tiny-timeline-item-content" @click.stop="changeOpen(detail, index)">
                    <span class="title" :class="{active: index === detail.activeId}">
                      <span v-if="info.bizType !== '4-0'">{{filterCodesBizType(info.bizType)}}</span>
                      <dict v-else dict-group="codeExceptionType" :dict-key="info.exceptionType"></dict>
                       <perm label="code-trace-log-delete" class="ml-15" v-show="index === detail.activeId">
                        <i class="el-icon-delete" style="color: red;cursor: pointer" @click.stop="deleteItem(info)"></i>
                       </perm>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <div v-for="(info) in detail.dtoList.filter((f, index) => index === detail.activeId)"
                 class="info-item open">
              <h2>
                <span>{{filterCodesBizType(info.bizType)}}</span>
              </h2>
              <el-tabs v-model="showType" size="mini" type="card" v-show="info.logisticsDetailDtos && info.logisticsDetailDtos.length">
                <el-tab-pane label="业务信息" name="1"></el-tab-pane>
                <el-tab-pane label="物流信息" name="2"></el-tab-pane>
              </el-tabs>
              <div>
                <el-row v-if="info.canWatch">
                  <div v-show="showType === '1'">
                    <div v-if="info.bizType === '4-0'">
                      <oms-row label='异常类型' :span="4">
                        <dict dict-group="codeExceptionType" :dict-key="info.exceptionType"></dict>
                      </oms-row>
                      <oms-row label='上报单位' :span="4" v-show="info.uploadOrg">{{info.uploadOrg}}</oms-row>
                      <oms-row label='上报人' :span="4" v-show="info.uploadMan">{{info.uploadMan}}</oms-row>
                      <oms-row label='上报时间' :span="4" v-show="info.handoverTime">{{info.handoverTime | time}}</oms-row>
                    </div>
                    <div v-else-if="info.bizType === '3-0'">
                      <oms-row label='零售/使用单位' :span="5" v-show="info.orgName">{{info.orgName}}</oms-row>
                      <oms-row label='零售/使用时间' :span="5" v-show="info.time">{{info.time | time}}</oms-row>
                    </div>
                    <div v-else>
                      <oms-row label='订单号' :span="4" v-show="info.orderNo">{{info.orderNo}}</oms-row>
                      <oms-row label='上游单位' :span="4" v-show="info.orgName">{{info.orgName}}</oms-row>
                      <oms-row label='下游单位' :span="4"
                               v-show="(info.bizType !== '1-3' || info.bizType !== '2-3') && info.directionOrgName">
                        {{info.directionOrgName}}
                      </oms-row>
                      <oms-row label='物流方式' :span="4" v-show="info.transportationMeans">
                        <!--<dict :dict-group="info.bizType.indexOf('1') === '0' ? 'transportationMeans' : 'outTransportMeans'"-->
                        <!--:dict-key="info.transportationMeans"></dict>-->
                        {{info.transportationMeans}}
                      </oms-row>
                      <oms-row label='运输条件' :span="4" v-show="info.logisticsMode">
                        <!--<dict dict-group="transportationCondition"-->
                        <!--:dict-key="info.logisticsMode"></dict>-->
                        {{info.logisticsMode}}
                      </oms-row>
                      <oms-row label='温度是否合格' :span="4" v-show="typeof info.temperatureFlag === 'boolean'">
                        <span v-show="info.temperatureFlag">合格</span>
                        <span v-show="!info.temperatureFlag">不合格</span>
                      </oms-row>
                      <oms-row label='操作单位' :span="4" v-show="info.systemOrg">{{info.systemOrg}}</oms-row>
                      <oms-row label='签收时间' :span="4" v-show="info.handoverTime">{{info.handoverTime | time}}</oms-row>
                      <oms-row label='签收人' :span="4" v-show="info.handoverPerson">{{info.handoverPerson}}</oms-row>
                      <oms-row label='签收单位' :span="4" v-show="info.handoverOrg">{{info.handoverOrg}}</oms-row>
                      <oms-row label='操作层级' :span="4">{{info.operateScheme}}级包装</oms-row>
                    </div>
                  </div>
                  <div v-if="showType === '2'">
                    <el-table :data="info.logisticsDetailDtos" style="width: 100%" class="mt-10 header-list">
                      <el-table-column prop="operatorName" label="操作人" min-width="100"/>
                      <el-table-column prop="address" label="地址" min-width="150"/>
                      <el-table-column prop="time" label="处理时间" min-width="140">
                        <span slot-scope="scope">{{scope.row.time | time}}</span>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注信息" min-width="150"/>
                    </el-table>
                    <waybill-info :current-order="info"/>
                  </div>
                </el-row>
                <el-row v-else class="no-rights-tooltip">无权查看</el-row>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>
  </div>
</template>
<script type="text/jsx">
  import {http} from '@/resources';
  import utils from '@/tools/utils';
  import DataMixin from '@/mixins/dataMixin';
  import waybillInfo from '@/components/common/order/waybillInfo';
  export default {
    mixins: [DataMixin],
    components: {waybillInfo},
    data: function () {
      return {
        labelSpan: 5,
        boxLabelSpan: 6,
        activeId: 0,
        currentCodeId: '',
        details: [],
        packageType: utils.packageType,
        loading: false,
        statusType: ['未知', '流转中', '已使用', '异常', '已报损'],
        showType: '1'
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 104) + 'px';
      }
    },
    mounted() {
      let id = this.$route.params.id;
      if (id !== 'id') {
        this.currentCodeId = id;
        this.getCodeInfo();
      }
    },
    methods: {
      deleteItem(item) {
        this.$confirm(`是否删除此业务记录`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/code-log/${item.id}`).then(res => {
            this.$notify.success({message: '删除成功'});
            this.getCodeInfo();
          }).catch(e => {
            this.$notify.error({
              title: '删除失败',
              message: e.response && e.response.data && e.response.data.msg
            });
          });
        });
      },
      getCodeInfo: function () {
        this.currentCodeId = this.currentCodeId.trim();
        this.details = [];
        if (!this.currentCodeId) {
          this.$router.push('/search/code/id');
          return;
        }
        this.loading = true;
        this.$router.push(`/search/code/${this.currentCodeId}`);
        http.get(`/code/${this.currentCodeId}/detail`).then(res => {
          res.data.forEach(i => {
            i.activeId = 0;
            i.dtoList.forEach(i => {
              i.open = false;
            });
          });
          this.details = res.data;
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        });
      },
      resetCode() {
        this.currentCodeId = '';
        this.$router.push('/search/code/id');
        this.details = [];
      },
      changeOpen(item, index) {
        item.activeId = index;
        this.showType = '1';
      },
      formatTime(time) {
        return this.$moment(time).format('YYYY-MM-DD HH:mm:ss');
      },
      formatDate(time) {
        return this.$moment(time).format('YYYY-MM-DD');
      },
      formatStatus(detail) {
        let obj = {
          title: this.statusType[detail.status],
          isDanger: false
        };
        if (detail.status === '3') obj.isDanger = true;
        if (detail.status === '1' && this.$moment(detail.expirationDate).diff(this.$moment(this.$moment().format('YYYY-MM-DD'))) < 0) {
          obj.title = '已过期';
          obj.isDanger = true;
        }
        return obj;
      },
      downloadJson() {
        let blob = new Blob([JSON.stringify(this.details)], {type: 'application/json'});
        let eleLink = document.createElement('a');
        eleLink.download = this.currentCodeId;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      }
    }
  };
</script>
