<style lang="scss" scoped=''>
  @import "../../assets/scss/mixins";

  .main-header {
    background: $bgColor;

    &, a {
      color: #fff;
    }

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: $topMenuHeight;
    z-index: 800;
    /*box-shadow: 0 5px 5px rgba(221, 221, 221, 0.22);*/
    ul, li {
      padding: 0;
      margin: 0;
      list-style: none
    }

    a {
      text-decoration: none
    }

    .container {
      position: relative;
    }

    .top-logo {
      vertical-align: middle;
      line-height: $topMenuHeight;
      height: $topMenuHeight;

      img {
        vertical-align: middle;
      }
    }

    .top-menu {
      position: absolute;
      top: 0;
      left: 260px;
      z-index: 1;
      right: 0;

      > ul {
        display: flex;

        > li {
          padding: 0 20px;

          &:not(:first-child) {
            margin-left: 1px;
          }

          a {
            display: block;
            line-height: $topMenuHeight;
            font-size: 14px;
            color: #fff;

          }

          &.active, &:hover {
            background: #4d566c;
          }
        }
      }
    }

    .top-right {
      position: absolute;
      right: 0;
      width: auto;
      z-index: 3;
      top: 50%;
      transform: translateY(-50%);

      .top-right-item {
        border-radius: 18px;
        background: $bgColor;
        line-height: 26px;
        display: inline-block;
        padding: 3px 10px;
        cursor: pointer;
        color: #fff;

        img {
          vertical-align: middle;
          height: 23px;
          width: 23px;
          border: 1px solid #eee;
          border-radius: 50%;
        }
      }

    }
  }

  .top-right-user-dropdown {
    margin-top: 1px;
    padding: 10px;
    box-shadow: 1px 1px 1px #eee;
    border-color: #eee
  }

  .menu-user-part {
    display: flex;
    align-items: center;

    > div > img {
      margin-right: 10px;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      border: 1px solid #eee
    }

    .menu-usr-part-phone {
      color: #666;
      font-size: 12px;
    }
  }

  .menu-user {
    padding: 8px 10px;

    .last-login {
      color: #999;
      font-size: 12px;
      margin: 10px 0;
    }

    a {
      color: $activeColor;
      font-size: 12px;
    }
  }

  .logo_pic {
    height: 32px;
    width: 32px;
    margin-right: 10px;
    margin-top: -8px;
  }

  .logo-span {
    font-size: 22px;
    font-weight: bold;
  }
</style>

<template>
  <div>
    <header class="main-header">
      <div class="container">
        <div class="top-logo">
          <router-link to='/' class="a-link"><img class="logo_pic" :src="logoUrl" @click="activeId=''">
            <span class="logo-span">{{ domainInfo.name ? domainInfo.name : 'TSS 追溯监控系统' }}</span>
          </router-link>
        </div>
        <nav class="top-menu">
          <ul>
            <li v-for="item in menu" :class="{'active':activeId === item.meta.moduleId}"
                @click.stop.prevent="goTo(item.subMenu.length ? item.subMenu[0]:item)">
              <perm :label="item.meta.perm">
                <a href="#"><i
                  :class="' el-icon-t-'+item.meta.icon"></i> {{item.meta.title}}</a>
              </perm>
            </li>
          </ul>
        </nav>
        <div class="top-right">
          <div class="top-user">
            <el-dropdown trigger="click">
              <div class="el-dropdown-link top-right-item">
                <compressed-img v-if="user.userIcon" :src="user.userIcon+'?image&action=resize:w_50,h_50,m_2'"/>
                <img v-else :src="logo"> {{user.userName}}
                <i class="el-icon-caret-bottom"></i>
              </div>
              <el-dropdown-menu class="top-right-user-dropdown" slot="dropdown">
                <div class="menu-user">
                  <div class="menu-user-part">
                    <div>
                      <oms-upload-picture :photoUrl="user.userIcon? user.userIcon : ''"
                                          class="user-img"></oms-upload-picture>
                    </div>
                    <div>
                      <div class="menu-usr-part-user">{{user.userName}}</div>
                      <div class="menu-usr-part-phone">{{user.userAccount}}</div>
                    </div>
                  </div>
                  <div class="last-login">上次登录时间:{{user.userLastLoginTime | time}}</div>
                  <div class="text-right">
                    <router-link style="float:left; margin-top: 2px;" to="/resetpsw">重置密码</router-link>
                    <a href="#" @click.stop.prevent="logout">退出</a>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <div v-if="subMenu.length>0">
      <div class="sub-menu" v-show="$route.path !=='/resetpsw'">
        <div class="container">
          <a v-for="(item,key) in subMenu" :href="item.path"
             @click.stop.prevent="goTo(item)"
             class="btn btn-sub-menu"
             :class="{'active':selectSubmenu(item)}">{{item.meta.title}}</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {Auth} from '../../resources';
  import logo from '../../../static/img/codes-logo-mini.png';
  import omsUploadPicture from '../common/upload/upload.user.picture.vue';

  export default {
    components: {
      omsUploadPicture
    },
    props: ['toRoute'],
    data() {
      return {
        logo: logo
      };
    },
    computed: {
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
      },
      menu: function () {
        let menuArr = this.$parent.$parent.menuData.filter(item => item.meta && item.meta.moduleId);
        menuArr.forEach(item => {
            if (/:id$/.test(item.path)) item.path = item.path.replace(':id', 'id');
            item.subMenu = item.children.filter(child => {
              if (/:id$/.test(child.path)) child.path = child.path.replace(':id', 'id');
              return this.$store.state.permissions.includes(child.meta.perm);
            });
          }
        );
        this.activeFirstMenu(menuArr);
        return menuArr;
      },
      subMenu: function () {
        let subMenu = [];
        if (!this.activeId) {
          subMenu = this.menu.length ? this.menu[0].subMenu : [];
        } else {
          this.menu.forEach(menu => {
            if (menu.meta.moduleId === this.activeId) {
              subMenu = menu.subMenu;
            }
          });
        }
        return subMenu;
      },
      domainInfo: function () {
        return this.$store.state.domainInfo;
      },
      logoUrl() {
        let logo = this.$store.state.domainInfo.logo;
        if (!logo) {
          logo = this.logo;
        }
        return logo;
      },
      activeId() {
        return this.$route.meta && this.$route.meta.moduleId || '';
      }
    },
    methods: {
      goTo: function (item) {
        this.$router.push({path: item.path});
      },
      getGroupId: function () {
        return this.toRoute.meta.moduleId;
      },
      activeFirstMenu(val) {
        if (this.$route.path === '/') {
          if (val[0]) {
            if (!val[0].subMenu.length) {
              this.$router.push(val[0].path);
            } else {
              this.$router.push(val[0].subMenu[0].path);
            }
          }
        }
      },
      selectSubmenu(item) {
        return item.path === this.$route.path ||
          item.meta.subModulePath === this.$route.path ||
          (item.meta.subMenuId && item.meta.subMenuId === this.$route.path.split('/')[2]);
      },
      logout: function () {
        window.localStorage.setItem('lastUrl', '');
        Auth.logout().then(() => {
          location.reload();
          // window.localStorage.setItem('userId', this.$store.state.user.userId);
          //          window.localStorage.removeItem('user');
          // return this.$router.replace('/login');
        });
      }
    },
    mounted: function () {

    }
  };
</script>
