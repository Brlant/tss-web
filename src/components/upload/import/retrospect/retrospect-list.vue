<style lang="scss" scoped>
  .t-head {
    background: #eef1f6;
    color: #1f2d3d;
    font-weight: bold;
  }

  .order-list {
    .order-list-header {
      line-height: 32px;
      height: 32px;
    }
  }
</style>
<template>
  <div class="order-list clearfix">
    <el-row class="order-list-header t-head" style="margin:0">
      <el-col :span="6">追溯码</el-col>
      <el-col :span="10">货品名称</el-col>
      <el-col :span="5">批号</el-col>
      <el-col :span="3">包装类型</el-col>
    </el-row>
    <el-row v-if="!traceCodes.length">
      <el-col :span="24">
        <div class="empty-info">
          暂无信息
        </div>
      </el-col>
    </el-row>
    <div v-else="" class="order-list-body">
      <div class="order-list-item no-pointer order-list-item-bg" v-for="item in traceCodes"
           style="margin-left: 0;margin-right: 0">
        <el-row>
          <el-col :span="6" class="R pt10">
            <span>{{ item.code }}</span>
          </el-col>
          <el-col :span="10" class="pt">
            <span>{{ item.goodsName }}</span>
          </el-col>
          <el-col :span="5" class="pt">
            <span>{{ item.batchNumber }}</span>
          </el-col>
          <el-col :span="3" class="pt">
                  <span>
                    {{ packageType[item.packageScheme-1] }}
                  </span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      traceCodes: {
        type: Array,
        default() {
          return [];
        }
      },
      packageType: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  };
</script>
