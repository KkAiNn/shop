import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import axios from 'axios'
import {
  getStore,setStore
} from '@/utils/storage.js'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
    error:'../../static/images/smile.png',
    loading:'../../static/images/load.gif'
})


axios.interceptors.request.use(config => {
  let token = getStore('token')
  if (token) {
    config.headers.common['Authorization'] = token
  }
  return config
}, err => {
  return Promise.reject(err)
})

Vue.prototype.$http = axios
Vue.config.productionTip = false;
Vue.use(ElementUI)


//路由守卫
router.beforeEach((to, from, next) => {


  axios.post('/api/verify', {}).then(res => {
    let data = res.data
    if (data.state != 1) {
      //判断是否默认跳转 用户未登录 调换登录界面
      if (to.matched.some(item => item.meta.auth)) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next()
      }
    }else{
      store.state.login = true 
      store.state.userInfo = data 
      setStore('userInfo',data)
      next()
    }
  })


})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");