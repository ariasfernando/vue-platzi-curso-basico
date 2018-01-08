import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import BootstrapVue from 'bootstrap-vue';
import Croppa from 'vue-croppa';
import interceptors from './interceptors';
import Bootstrap from './bootstrap';
import store from './store';
import Campaign from './components/campaign/Campaign.vue';
import { campaignDictionary } from './resources/dictionary';

Vue.use(Bootstrap);
Vue.use(VueResource);
Vue.use(VeeValidate);
VeeValidate.Validator.localize('en', campaignDictionary);

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
});
Vue.use(BootstrapVue);
Vue.use(Croppa);
Vue.use(interceptors);

const app = new Vue({
  store,
  components: {
    Campaign,
  },
  comments: true,
}).$mount('#campaign');
