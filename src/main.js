import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './assets/scss/element-variables.scss';
import './assets/css/oms.css';
import './assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import {init} from './tools/init';
import App from './components/App.vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

init(Vue);

Vue.use(require('vue-moment'), {moment});
Vue.use(tinyVue);
Vue.use(Vuex);

if (process.env.NODE_ENV === 'production') {
  Raven
    .config('https://62f56ceea555483fab3d6238ff4a80d0@f-log.cdcerp.net/3', {
      serverName: 'codes',
      shouldSendCallback: (date) => {// 过滤错误日志
        let filterArray = ['Request failed with status code 401', 'Request failed with status code 502'];
        if (date && date.hasOwnProperty('exception') && date.exception.hasOwnProperty('values') && filterArray.indexOf(date.exception.values[0].value) > -1) {
          return false;
        }
        return date;
      }
    })
    .addPlugin(RavenVue, Vue)
    .install();
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
