<style lang="scss" scoped>
  .product-code-list {
    margin-top: 20px;
    text-align: center;
    border-collapse: collapse;
    font-size: 12px;

    td {
      height: 24px;
      border: 1px solid #dfe6ec;
    }
  }

  .t-head {
    background: #eef1f6;
    color: #1f2d3d;
    font-weight: bold;
  }
</style>
<template>
  <table class="clearfix product-code-list mt-10" width="100%" v-if="codes.length">
    <tbody>
    <tr class="t-head">
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" frame="void">
          <tr>
            <td width="300px">货品</td>
            <td width="120px">批号</td>
            <td width="120px">生产日期</td>
            <td width="120px">有效期</td>
            <td>合计货品数量</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" frame="void">
          <tr v-for="i in codes">
            <td width="300px">{{i.goodsName}}</td>
            <td width="120px">{{i.batchNumber}}</td>
            <td width="120px">{{i.productionDate | date}}</td>
            <td width="120px">{{i.expiryDate | date}}</td>
            <td>
              {{i.total}}
              <dict :dict-group="'measurementUnit'" :dict-key="i.measurementUnit"></dict>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    </tbody>
  </table>
  <div v-else>无</div>
</template>
<script>
  export default {
    props: {
      codes: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  };
</script>
