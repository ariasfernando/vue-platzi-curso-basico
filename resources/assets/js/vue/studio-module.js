import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import interceptors from './interceptors';
import { studioModuleRoutes } from './router';
import store from './store';

Vue.use(Toast);
Vue.use(VueResource);
Vue.use(interceptors);
Vue.use(VueRouter);
Vue.use(VeeValidate);

// Pointing routes to the components they should use
const router = new VueRouter({
  routes: studioModuleRoutes,
  mode: 'hash',
  base: '/admin/module/',
  saveScrollPosition: true,
});

const app = new Vue({
  router,
  store
}).$mount('#studio');