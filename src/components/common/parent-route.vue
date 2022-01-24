<template>
  <transition appear mode="out-in" name="scale">
    <router-view></router-view>
  </transition>
</template>
<script>
  import {route} from '@/route';

  export default {
    watch: {
      $route() {
        this.goPath();
      }
    },
    mounted() {
      this.goPath();
      setTimeout(this.checkPwd,200);
    },
    methods: {
      // 检查密码，如果密码强度不符合配置的规则提示用户修改密码
      checkPwd() {
        let {updatePassFlag, passwordRule: days} = this.$store.state.user;
        if (!updatePassFlag || !days){
          // 如果密码正常，不需要修改，那就直接pass
          return;
        }

        // 如果需要修改密码，给出提示：您当前登录密码使用已超过xx天，为保证您的账号安全，请立即修改。
        this.$alert('您当前登录密码使用已超过' + days + '天，为保证您的账号安全，请立即修改。', '安全提示', {
          confirmButtonText: '去修改', center: true,showClose:false
        }).then(() => {
          console.warn("用户点击了去修改，即将跳转到重置密码页面。");
          this.$router.push("/resetpsw")
        }).catch(err=>{
          console.log(err)
        });
      },
      goPath() {
        let children = [];
        let path = this.$route.path.replace(/\/$/, '');
        let isHas = route[0].children.some(s => {
          let exist = s.path === path;
          if (exist) {
            children = s.children;
          }
          return exist;
        });
        if (!isHas) return;
        this.$router.push('/');
      }
    }
  };
</script>
