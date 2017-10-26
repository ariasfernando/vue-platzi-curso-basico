import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource/dist/vue-resource';
import Toast from 'vue-easy-toast';
import BootstrapVue from 'bootstrap-vue';
import interceptors from './interceptors';
import Config from './config';
import Dashboard from './components/dashboard/Dashboard.vue';

Vue.use(Config);
Vue.use(VueResource);
Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
});
Vue.use(BootstrapVue);
// @TODO check undefined Vue.http
// Vue.use(interceptors);
const app = new Vue({
  components: {
    Dashboard,
  }
}).$mount('#dashboard');
