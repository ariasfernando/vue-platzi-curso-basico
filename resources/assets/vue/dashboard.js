import Vue from 'vue/dist/vue'

import VueResource from 'vue-resource/dist/vue-resource'
Vue.use(VueResource);

// Notifications component (https://github.com/noru/vue-easy-toast)
import Toast from 'vue-easy-toast'
Vue.use(Toast);

import interceptors from './interceptors'
Vue.use(interceptors);

Vue.config.debug = false;
Vue.config.silent = true;

import Dashboard from './components/dashboard/Dashboard.vue'

window.vm = new Vue({
  el: '#dashboard',
  components: {Dashboard}
});

