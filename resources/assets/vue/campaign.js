import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import interceptors from './interceptors';
import Config from './config';
import store from './store';
import Campaign from './components/campaign/Campaign.vue';

Vue.use(Config);
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(Toast);
Vue.use(interceptors);

const app = new Vue({
  store,
  components: {
    Campaign,
  },
}).$mount('#campaign');
