<style lang="scss" scoped>
//用短信验证码登录
.login-style {
  margin-bottom: 20px;

  .btn {
    color: deepskyblue;
    right: 50px;
    position: fixed;
    top: 175px;
    font-size: 16px;
  }
}
.flex{
  display: flex;
  .cursor{
    cursor: pointer;
  }
}
.title{
  margin: 0px auto 30px auto;
  text-align: center;
  color:#707070;
}
</style>
<template>
  <div class="login-part">
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix"><img :src="logoUrl">{{ domainInfo.name ? domainInfo.name : 'TSS 追溯监控系统' }}</div>
<!--      <div class="login-style">-->
<!--        <el-button v-show="loginStyle === 0" class="btn" type="text" @click="changeLoginStyle(1)">用短信验证码登录</el-button>-->
<!--        <el-button v-show="loginStyle === 1" class="btn" type="text" @click="changeLoginStyle(0)">用短信验证码登录</el-button>-->
<!--      </div>-->

      <div class="form-part">
        <el-form v-show="loginStyle===0"  :model="user" :rules="rules" @submit.prevent="onSubmit" label-position="top" label-width="80px"
                 onsubmit="return false" ref="loginForm">
          <el-form-item label="业务单位编号" prop="orgCode" v-if="needCode">
            <!--<oms-input v-model="user.orgCode"></oms-input>-->
            <tn-input-auto-complete :list="orgCodeList" placeholder="请输入业务单位编号" v-model="user.orgCode"/>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <oms-input @blur="check()" placeholder="手机号/邮箱/用户名" v-model="user.username"></oms-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="position:relative">
            <oms-input placeholder="请输入密码" type="password" v-model="user.password"></oms-input>
            <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>
          </el-form-item>
          <el-form-item label="验证码" v-show="showCode">
            <div style="display:flex">
              <div style="width:300px;margin-right:50px">
                <oms-input v-model="user.validateCode"></oms-input>
              </div>
              <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height: 36px"></div>
            </div>

          </el-form-item>

          <el-form-item label-width="80px">
            <el-button @click="onSubmit" native-type="submit" style="display:block;width:100%;height: 50px" type="primary">
              {{btnString}} <i class="el-icon-loading" v-show="loading"></i></el-button>

          </el-form-item>
        </el-form>

        <!--手机验证码登录-->
<!--        <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"-->
<!--                 :model="user1" :rules="rules1"-->
<!--                 onsubmit="return false">-->
<!--          <el-form-item label="手机号" prop="phone">-->
<!--            <oms-input v-model="user1.phone" placeholder="请输入手机号"></oms-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="短信验证码" prop="validateCode">-->
<!--            <div style="display:flex">-->
<!--              <div style="width:320px;margin-right:50px">-->
<!--                <el-input v-model="user1.validateCode" placeholder="请输入短信验证码"></el-input>-->
<!--              </div>-->
<!--              <div style="line-height:0;">-->
<!--                <el-button :disabled="smsBtnDisabled" @click="sendSMS">{{ smsBtnText }}</el-button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </el-form-item>-->

<!--          <el-form-item label-width="80px">-->
<!--            <el-button type="primary" @click="phoneFormSubmit" style="display:block;width:100%;" native-type="submit">-->
<!--              {{ btnString }} <i class="el-icon-loading" v-show="loading"></i></el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        二级认证-->
        <el-form v-show="loginStyle===1" class="login-form" label-position="top" ref="phoneForm" label-width="80px"
                 :model="user1" :rules="rules1"
                 onsubmit="return false">
          <div class="flex">
            <i class="el-icon-arrow-left cursor" @click="goBack"></i>
            <h3 class="title">二次认证</h3>
          </div>
          <el-form-item label="短信验证码" prop="validateCode">
            <div style="display:flex">
              <div style="width:300px;margin-right:50px">
                <el-input v-model="user1.validateCode" placeholder="请输入短信验证码"></el-input>
              </div>
              <div style="line-height:0;">
                <el-button :disabled="smsBtnDisabled" style="width: 110px" @click="sendSMS">{{ smsBtnText }}</el-button>
              </div>
            </div>
          </el-form-item>

          <drag-verify
            ref="dragVerify"
            :isPassing.sync="isPassing"
            style="margin-bottom: 20px;width: 400px;"
            :width="400"
            text="请按住滑块,拖动到最右边"
            handlerIcon="el-icon-d-arrow-right"
            successIcon="el-icon-circle-check"
            background="#ccc"
            successText="验证通过"
            progressBarBg="#67c23a"
            @passcallback="handlePass"
            @passfail="handleFail"
          >
          </drag-verify>

        </el-form>
      </div>
    </el-card>
    <canvas id="backgroundCanvas"></canvas>
    <app-footer></app-footer>
  </div>

</template>

<script>
  import {Auth, DhsBaseInfo,http} from '../../resources';
  import AppFooter from '../layout/app.footer.vue';
  import {base64} from '@dtop/dtop-web-common';
  import dragVerify from "vue-drag-verify2";

  export default {
    name: 'login',
    components: {
      AppFooter,
      dragVerify
    },
    data: () => {
      let orgCodeList = JSON.parse(window.localStorage.getItem('orgCodeList')) || [];
      let needCode = !!orgCodeList.length;
      let orgCode = window.localStorage.getItem('orgCode');
      orgCode = orgCode && orgCode !== 'null' ? orgCode : '';
      return ({
        // 登录方式：0-账号密码登录，1-手机验证码登录
        loginStyle: 0,
        user: {
          username: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '',
          password: '',
          validateCode: '',
          type: 1,
          orgCode
        },
        loading: false,
        codeUrl: '',
        showCode: false,
        btnString: '登录',
        rules: {
          orgCode: [
            {required: true, message: '请输入业务单位编号', trigger: ['blur', 'change']}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        needCode,
        orgCodeList,
        //短信验证
        user1: {
          phone: '',
          validateCode: '',
          type: 0
        },
        rules1: {
          phone: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入手机号'));
                } else {
                  if (!/^1[0-9]{10}$/.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                  }else {
                    callback();
                  }
                }
              }, trigger: 'blur'
            }
          ],
          validateCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          // password: [
          //   {required: true, message: '请输入密码', trigger: 'blur'}
          // ]
        },
        maxTimes: 60,
        leftTime: 0,
        smsBtnText: '获取验证码',
        isPassing:false,
      });
    },
    computed: {
      domainInfo: function () {
        return this.$store.state.domainInfo;
      },
      logoUrl() {
        let logo = this.$store.state.domainInfo.logo;
        if (!logo) {
          logo = '/static/img/codes-logo.png';
        }
        return logo;
      },
      // smsBtnDisabled() {
      //   return !/^1[0-9]{10}$/.test(this.user1.phone) || this.leftTime > 0;
      // }
      smsBtnDisabled() {
        return this.leftTime > 0;
      }
    },
    methods: {
      //切换
      changeLoginStyle(loginStyle) {
        this.loginStyle = loginStyle;
      },
      sendSMS: function () {
        this.leftTime = this.maxTimes;
        this.setTimer();
        http.post('/sendSms', {phone: this.user1.phone}).then(response => {// 验证
          this.$notify.info({
            message: '发送成功'
          });
        }, () => {
          this.$notify.error({
            message: '发送失败,请联系管理员'
          });
        });
      },
      setTimer: function () {
        if (this.leftTime > 0) {
          this.leftTime = this.leftTime - 1;
          this.smsBtnText = this.leftTime + 's';
          setTimeout(() => {
            this.setTimer();
          }, 1000);
        } else {
          this.smsBtnText = '重新发送';
        }
      },
      phoneFormSubmit() {
        this.$refs['phoneForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登录中..';
            this.loading = true;
            Auth.loginByPhone(this.user1).then(response => {
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initUser', response.data);
              window.localStorage.setItem('orgCode', this.user.orgCode);
              this.$emit('login');
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg || '登录失败'
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              if (data.code === 405) {
                this.needCode = true;
              }
              this.btnString = '登录';
              this.loading = false;
            });
          }
        });
      },
      // 二次验证登录
      handlePass() {
        console.log('验证成功')
      },

      // 验证失败
      handleFail() {
        this.resetDragVerify();
      },
      // 还原至未验证通过状态
      resetDragVerify() {
        this.isPassing = false;
        this.$refs.dragVerify.reset();
      },
      goBack() {
        this.loginStyle = 0;
        this.user1 = {
          validateCode:null,
        }
        this.$refs.phoneForm.resetFields();
        this.handleFail();
      },
      onSubmit(){
        this.loginStyle = 1;
      },
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登录中..';
            this.loading = true;
            let user = Object.assign({}, this.user);
            user.orgCode = this.needCode ? this.trim(this.user.orgCode) : '';
            user.encryptionPsw = base64(user.password);
            delete user.password;
            Auth.login(user).then(response => {
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initUser', response.data);
              window.localStorage.setItem('orgCode', this.user.orgCode);
              this.$emit('login');
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg || '登录失败'
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              if (data.code === 405) {
                this.needCode = true;
              }
              this.btnString = '登录';
              this.loading = false;
            });
          }
        });

      },
      check() {
        // 为空时, 不用做判断
        if (!this.user.username) return;
        this.$http.post('/dhs/login/check', {username: this.trim(this.user.username)}).catch(error => {
          if (error.response.status === 405) {
            this.needCode = true;
            let list = error.response.data && error.response.data.map(m => ({value: m}));
            window.localStorage.setItem('orgCodeList', JSON.stringify(list || ''));
          }
        });
      },
      trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
      },
      getCode: function () {
        this.showCode = true;
        this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
      },
      queryBaseInfo(data) {
        DhsBaseInfo.queryBaseInfo(data.userCompanyAddress).then(res => {
          data.dhsOrgId = res.data.orgDto.dhsOrgId;
        });
      },
      queryDomainInfo() {
        this.$http.get('/code-domain/domain-name').then(res => {
          this.$store.commit('initDomainInfo', res.data);
        }).catch(() => {
          this.$store.commit('initDomainInfo', {});
        });
      }
    },
    mounted: function () {
      this.$store.commit('initPermissions', []);
      this.queryDomainInfo();
    }
  };
</script>
