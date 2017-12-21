// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './components/App';
import router from './router';
import axios from 'axios';
Vue.prototype.$http = axios;

import VueLazyload from 'vue-lazyload';


// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './static/images/default.png',
  loading: './static/images/default.png',
  attempt: 1,
});

import Rem from './lib/rem';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  render: (createElement) => createElement(App)
});
