import Vue from 'vue'
import App from './App'
import router from './router'
import './common/css/reset.css'
import './common/fonts/iconfont.css'
import store from '@/vuex/store';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
