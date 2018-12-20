import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import BootstrapVue from 'bootstrap-vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import interceptors from './interceptors';
import Bootstrap from './bootstrap';
import { globalSettingeRoutes } from './router';
import store from './store';

Vue.use(Bootstrap);
Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true,
});
Vue.use(VueResource);
Vue.use(interceptors);
Vue.use(VueRouter);
Vue.use(VeeValidate);
Vue.use(BootstrapVue);
Vue.use(ElementUI, { locale });

// Pointing routes to the components they should use
const router = new VueRouter({
  routes: globalSettingeRoutes,
  mode: 'hash',
  base: '${baseUrl}/admin/settings/',
  saveScrollPosition: true,
});

const app = new Vue({
  router,
  store,
}).$mount('#studio');

$.ajaxSetup({
  headers: {
    'X-CSRF-token': Application.globals.csrfToken,
  },
});