import Vue from 'vue';
import VueResource from 'vue-resource/dist/vue-resource';
import Toast from 'vue-easy-toast';
import BootstrapVue from 'bootstrap-vue';
import interceptors from './interceptors';
import Bootstrap from './bootstrap';
import Dashboard from './components/dashboard/Dashboard.vue';
import store from './store';
import acl from './resources/plugins/acl';

Vue.use(Bootstrap);
Vue.use(VueResource);
Vue.use(acl);
Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true
});
Vue.use(BootstrapVue);
Vue.use(interceptors);

window.vm = new Vue({
  store,
  components: {
    Dashboard,
  }
}).$mount('#dashboard');

$.ajaxSetup({
  headers: {
    'X-CSRF-token': Application.globals.csrfToken
  }
});
