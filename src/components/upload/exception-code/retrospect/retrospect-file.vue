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

          .attachment-delete, .download-link {
            display: inline;
            position: absolute;
            top: 55%;
            transform: translateY(-50%);
            cursor: pointer;
          }

          .download-link {
            right: 15px;
          }

          .attachment-delete {
            right: 40px;
          }

          .download-link {
            color: #9ea7b4;
          }

          &:hover .download-link {
            display: inline;
            color: rgb(92, 214, 255);
          }

          &:hover .attachment-delete {
            display: inline;
            color: red;
          }
        }
      }
    }
  }
</style>
<template>
  <div v-show="orderAttachment.length">
    <div class="qp-box accessory">
      <div class="accessory-list clearfix">
        <div v-if="orderAttachment.length">
          <ul class="show-list">
            <li class="list-item" v-for="item in orderAttachment" :key="item.fileId">
              <el-tag :type="item.fileStatus === 0 ? 'warning' : item.fileStatus === 1 ? 'success' : 'danger'">
                {{item.fileStatus === 0 ? '解析中' : item.fileStatus === 1 ? '正常' : '异常'}}
              </el-tag>
              {{ item.fileName }}
              <a @click.prevent="downloadFile(item)" class="download-link">
                <i class=" el-icon-t-download"></i>
              </a>
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
      orderAttachment: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        fileTypes: ['解析中', '正常', '错误'],
        prodEnvApi: process.env.VUE_APP_API
      };
    },
    methods: {
      downloadFile(attachment) {
        this.$store.commit('initPrint', {isPrinting: true});
        this.$http({
          url: attachment.storagePath,
          timeout: 1000000,
          responseType: 'blob',
          withCredentials: false
        }).then(res => {
          this.$store.commit('initPrint', {isPrinting: false});
          this.funDownload(res.data, attachment.fileName);
        });
      },
      funDownload: function (blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          const body = document.querySelector('body');

          link.href = window.URL.createObjectURL(blob);
          link.download = filename;

          // fix Firefox
          link.style.display = 'none';
          body.appendChild(link);

          link.click();
          body.removeChild(link);

          window.URL.revokeObjectURL(link.href);
        }
      }
    }
  };
</script>
