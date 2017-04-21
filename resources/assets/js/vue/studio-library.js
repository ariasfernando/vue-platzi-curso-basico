import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource/dist/vue-resource'
import Toast from 'vue-easy-toast'
import interceptors from './interceptors'
import store from './store'
import {studioLibraryRoutes} from './router'
import VeeValidate from 'vee-validate'

Vue.use(Toast);
Vue.use(VueResource);
Vue.use(interceptors);
Vue.use(VueRouter);
Vue.use(VeeValidate);

// Pointing routes to the components they should use
const router = new VueRouter({
  routes: studioLibraryRoutes,
  mode: 'hash',
  base: '/admin/library/',
  saveScrollPosition: true,
});

const app = new Vue({
  router,
  store
}).$mount('#studio');