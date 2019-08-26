<style lang="scss" scoped="">
  .content-part {
    .content-left {
      width: 0;
    }

    .content-right {
      > h3 {
        left: 0;
      }

      left: 0;
    }
  }

  .right-item-list {
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 8px 20px;
    margin-bottom: 10px;
    text-align: left;
    position: relative;

    .scope-span {
      display: inline-block;
      width: 200px;
    }

    .scope-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      display: none;
      color: rgb(200, 0, 0);
      cursor: pointer;
    }

    &:hover {
      .scope-icon {
        display: block
      }

    }
  }
</style>
<template>
  <div class="content-part">
    <!--<div class="content-left">-->
    <!--<h2 class="clearfix right-title" style="font-size: 16px">上传追溯码</h2>-->
    <!--</div>-->
    <div class="content-right min-gutter">
      <h3>数据共享的域名</h3>
      <el-form ref="rangeform" :model="form" :rules="rules" label-width="80px" @submit.prevent="onSubmit('rangeform')"
               onsubmit="return false" v-loading="doing">
        <el-form-item label="域名" prop="domain">
          <el-select v-model="form.domain" filterable clearable remote :remoteMethod="queryDomain"
                     placeholder="请选择域名" popperClass="custom-select">
            <el-option v-for="item in filterDomainList" :value="item.domainName" :key="item.id">
              <div>{{item.domainName}}</div>
              <div class="f-grey">追溯平台：{{item.name}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button type="primary" @click="add('rangeform')" native-type="submit" :disabled="doing">添加</el-button>
        </el-form-item>
        <div class="right-item-list" v-for="item in scopes">
          <span class="scope-span">域名：{{item.domainName}}</span>
          <span class="f-grey">追溯平台：{{item.name}}</span>
          <i class="el-icon-close scope-icon" @click="remove(item)"></i>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        form: {
          domain: ''
        },
        rules: {
          domain: [
            {required: true, message: '请输入域名', trigger: 'change'}
          ]
        },
        domainList: [],
        scopes: [],
        doing: false
      };
    },
    computed: {
      filterDomainList() {
        return this.domainList.filter(f => !this.scopes.some(s => s.domainName === f.domainName));
      }
    },
    props: ['currentItem', 'showDetail'],
    watch: {
      showDetail(val) {
        if (!val) return;
        this.$refs['rangeform'].resetFields();
        this.scopes = [];
        this.query();
        this.queryDomain();
      }
    },
    methods: {
      queryDomain(query) {
        this.$http.get('/code-domain', {params: {domainName: query, pageSize: 100}}).then(res => {
          this.domainList = res.data;
        });
      },
      remove: function (item) {
        this.$confirmOpera(`是否删除域名"${item.domainName}"`, () => {
          let ary = [].concat(this.scopes);
          let index = ary.indexOf(item);
          ary.splice(index, 1);
          this.save(() => {
            this.$notify.success({message: '删除成功'});
            let index = this.scopes.indexOf(item);
            this.scopes.splice(index, 1);
          }, (e) => {
            this.$notify.error({message: e.response && e.response.data.msg || '删除失败'});
          }, ary);
        });
      },
      add: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          let item = this.domainList.find(i => i.domainName === this.form.domain);
          let ary = [].concat(this.scopes, [item]);
          this.save(() => {
            this.$notify.success({message: '添加成功'});
            this.scopes.push(item);
            this.$refs[formName].resetFields();
          }, (e) => {
            this.$notify.error({message: e.response && e.response.data.msg || '添加失败'});
          }, ary);
        });
      },
      save(success, fail, ary) {
        let obj = {
          objectId: this.currentItem.id,
          domainCodeList: (ary || this.scopes).map(m => m.code)
        };
        this.doing = true;
        this.$http.post('/code-upload/bind/domain', obj).then(res => {
          this.doing = false;
          success && success(res);
        }).catch(e => {
          this.doing = false;
          fail && fail(e);
        });
      },
      doClose: function () {
        this.$emit('close');
      },
      query() {
        this.doing = true;
        this.$http.get(`/code-upload/${this.currentItem.id}/bind/domain`).then(res => {
          this.scopes = res.data;
          this.doing = false;
        }).catch(e => {
          this.doing = false;
        });
      }
    }
  };
</script>

