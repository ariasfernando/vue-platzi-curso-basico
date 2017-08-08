import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import Draggable from 'vuedraggable';
import interceptors from './interceptors';
import Config from './config';
import { studioModuleRoutes } from './router';
import store from './store';

Vue.use(Config);
Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
});
Vue.use(VueResource);
Vue.use(Draggable);
Vue.use(interceptors);
Vue.use(VueRouter);
Vue.use(VeeValidate);

// Pointing routes to the components they should use
const router = new VueRouter({
  routes: studioModuleRoutes,
  mode: 'hash',
  base: '${baseUrl}/admin/module/',
  saveScrollPosition: true,
});

const app = new Vue({
  router,
  store,
}).$mount('#studio');
