import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource/dist/vue-resource'
import Toast from 'vue-easy-toast'
import interceptors from './interceptors'
import store from './store'
import {studioModuleRoutes} from './router'

Vue.use(Toast);
Vue.use(VueResource);
Vue.use(interceptors);
Vue.use(VueRouter);

// Pointing routes to the components they should use
const router = new VueRouter({
  routes: studioModuleRoutes,
  mode: 'hash',
  base: '/admin/module/',
  saveScrollPosition: true,
});

const app = new Vue({
  router,
  store,
  created() {
    console.log(this.$route)
  }
}).$mount('#studio');