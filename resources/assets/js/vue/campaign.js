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

import Campaign from './components/campaign/Campaign.vue'
import store from './store'

window.vm = new Vue({
    el: '#campaign',
    store: store,
    components: { Campaign }
});