<style lang="scss" scoped>
  .title {
    line-height: 20px;
    padding: 10px 0 5px 0;
  }

  .qp-box {
    &.accessory {
      margin-bottom: 10px;
      padding: 0 10px 10px 0;
    }

    .accessory-list {
      .show-list {
        .list-item {
          position: relative;
          padding: 5px 40px 5px 20px;
          cursor: auto;
        }

        .scope-span {
          display: inline-block;
          width: 200px;
        }
      }
    }
  }
</style>
<template>
  <div>
    <el-row v-if="!domains.length">
      <el-col :span="24">
        <div class="empty-info is-mini">
          暂无信息
        </div>
      </el-col>
    </el-row>
    <div v-else>
      <div class="qp-box accessory">
        <div class="accessory-list clearfix">
          <ul class="show-list">
            <li class="list-item" v-for="(item, index) in domains" :key="index">
              <span class="scope-span">域名：{{item.domainName}}</span>
              <span class="f-grey">追溯平台：{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      currentItem: Object,
      showDetail: Boolean
    },
    data() {
      return {
        domains: []
      };
    },
    watch: {
      showDetail(val) {
        this.domains = [];
        if (!val) return;
        this.query();
      }
    },
    methods: {
      query() {
        this.doing = true;
        this.$http.get(`/code-upload/${this.currentItem.id}/bind/domain`).then(res => {
          this.domains = res.data;
          this.doing = false;
        }).catch(e => {
          this.doing = false;
        });
      }
    }
  };
</script>

