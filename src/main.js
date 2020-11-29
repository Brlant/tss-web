import Vue from 'vue';
import router from './routers';
import tinyVue from './lib/tinyVue';
import 'dayjs/locale/zh-cn';
import './assets/scss/element-variables.scss';
import './assets/css/oms.css';
import './assets/fonts/iconfont.css';
import Vuex from 'vuex';
import store from './store';
import {init} from './tools/init';
import App from './components/App.vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import VueAMap from 'vue-amap';
init(Vue);

Vue.use(tinyVue);
Vue.use(Vuex);
Vue.use(VueAMap);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://eb94ae86f9104780be615d09d50416f2@f-log.sinopharm-bio.com/3',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
    shouldSendCallback: (date) => {// 过滤错误日志
      let filterArray = ['Request failed with status code 401', 'Request failed with status code 502'];
      if (date && date.hasOwnProperty('exception') && date.exception.hasOwnProperty('values') && filterArray.indexOf(date.exception.values[0].value) > -1 || date && date.transaction && date.transaction.indexOf('http://requirejs.org/docs/errors.html') > -1) {
        return false;
      }
      return date;
    }
  });
}

window.$mapInit = function () {
  if (window.AMap) return;
  VueAMap.initAMapApiLoader({
    key: 'b551e033d09a45de75ebbc1170025c20',
    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geocoder'],
    uiVersion: '1.0',
    v: '1.4.4'
  });
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
