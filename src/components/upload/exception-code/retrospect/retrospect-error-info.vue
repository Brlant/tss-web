<style lang="scss">
  .u-list {
    .itm {
      padding: 4px 0;
      border-bottom: 1px solid #eee;

      p, h4 {
        margin: 0;
      }

      p {
        margin-left: 20px;
      }

      .content {
        /*padding-left: 10px;*/
      }
    }
  }
</style>
<template>
  <div v-if="errorAttachmentList.length">
    <ul class="u-list">
      <li class="itm" v-for="(item, index) in errorAttachmentList">
        <h4>源文件：{{item.fileName}}</h4>
        <h4 class="content">1.错误类型</h4>
        <p>{{item.fileStatusTitle}}</p>
        <div v-show="item.error">
          <h4 class="content">2.错误内容</h4>
          <p>{{item.error}}</p>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>无</div>
</template>
<script>
  export default {
    props: {
      orderAttachment: Array
    },
    computed: {
      errorAttachmentList() {
        return this.orderAttachment.filter(f => f.fileStatus > 1);
      }
    },
    data() {
      return {
        activeNames: []
      };
    },
    watch: {
      errorAttachmentList(val) {
        this.activeNames = val.map((m, index) => index);
      }
    }
  };
</script>
