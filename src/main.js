import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import QRCode from 'qrcode'
import App from './App'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
// import md5 from 'md5.js'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import route from './route.js'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(QRCode)
Vue.use(VueResource)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(localStorage.getItem('token'));
  if (!user && to.path != '/login') {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})


new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')