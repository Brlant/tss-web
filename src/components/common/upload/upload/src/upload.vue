<template>
  <div :class="'el-upload--'+listType" @click="handleClick" class="el-upload">
    <upload-dragger :disabled="disabled" @file="uploadFiles" v-if="drag">
      <slot></slot>
    </upload-dragger>
    <slot v-else></slot>
    <input :accept="accept" :multiple="multiple" :name="name" @change="handleChange" class="el-upload__input" ref="input"
           type="file"/>
  </div>
</template>
<script>
  import ajax from './ajax';
  import UploadDragger from './upload-dragger.vue';

  export default {
    inject: ['uploader'],
    components: {
      UploadDragger
    },
    props: {
      type: String,
      action: {
        type: String,
        required: true
      },
      name: {
        type: String,
        default: 'file'
      },
      data: Object,
      headers: Object,
      withCredentials: Boolean,
      multiple: Boolean,
      accept: String,
      onStart: Function,
      onProgress: Function,
      onSuccess: Function,
      onError: Function,
      beforeUpload: Function,
      drag: Boolean,
      onPreview: {
        type: Function,
        default: function () {
        }
      },
      onRemove: {
        type: Function,
        default: function () {
        }
      },
      fileList: Array,
      autoUpload: Boolean,
      listType: String,
      httpRequest: {
        type: Function,
        default: ajax
      },
      disabled: Boolean,
      formData: {
        type: Object
      }
    },

    data() {
      return {
        mouseover: false,
        reqs: {}
      };
    },

    methods: {
      isImage(str) {
        return str.indexOf('image') !== -1;
      },
      handleChange(ev) {
        const files = ev.target.files;
        if (!files) return;
        this.uploadFiles(files);
      },
      uploadFiles(files) {
        let postFiles = Array.prototype.slice.call(files);
        if (!this.multiple) {
          postFiles = postFiles.slice(0, 1);
        }

        if (postFiles.length === 0) {
          return;
        }

        postFiles.forEach(rawFile => {
          this.onStart(rawFile);
          if (this.autoUpload) this.upload(rawFile);
        });
      },
      upload(rawFile, file) {

        this.$refs.input.value = null;

        if (!this.beforeUpload) {
          return this.post(rawFile);
        }

        const before = this.beforeUpload(rawFile);
        if (before && before.then) {
          before.then(processedFile => {
            if (Object.prototype.toString.call(processedFile) === '[object File]') {
              this.post(processedFile);
            } else {
              this.post(rawFile);
            }
          }, () => {
            this.onRemove(null, rawFile);
          });
        } else if (before !== false) {
          this.post(rawFile);
        } else {
          this.onRemove(null, rawFile);
        }
      },
      abort(file) {
        const {reqs} = this;
        if (file) {
          let uid = file;
          if (file.uid) uid = file.uid;
          if (reqs[uid]) {
            reqs[uid].abort();
          }
        } else {
          Object.keys(reqs).forEach((uid) => {
            if (reqs[uid]) reqs[uid].abort();
            delete reqs[uid];
          });
        }
      },
      post(rawFile) {
        const {uid} = rawFile;
        const options = {
          headers: this.headers,
          withCredentials: this.withCredentials,
          file: rawFile,
          data: this.data,
          filename: this.name,
          action: this.action,
          onProgress: e => {
            this.onProgress(e, rawFile);
          },
          onSuccess: res => {
            this.onSuccess(res, rawFile);
            delete this.reqs[uid];
          },
          onError: err => {
            this.onError(err, rawFile);
            delete this.reqs[uid];
          }
        };
        const req = this.httpRequest(options, Object.assign({
          objectId: '',
          objectType: ''
        }, this.formData, {fileName: rawFile.name}));
        this.reqs[uid] = req;
        if (req && req.then) {
          req.then(options.onSuccess, options.onError);
        }
      },
      handleClick() {
        if (!this.disabled) {
          this.$refs.input.value = null;
          this.$refs.input.click();
        }
      }
    }
  };
</script>
