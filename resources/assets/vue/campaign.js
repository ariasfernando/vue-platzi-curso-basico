import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import elementUi from 'element-ui';
import BootstrapVue from 'bootstrap-vue';
import Croppa from 'vue-croppa';
import interceptors from './interceptors';
import Bootstrap from './bootstrap';
import store from './store';
import Campaign from './components/campaign/Campaign.vue';
import { campaignDictionary } from './resources/dictionary';
import 'url-search-params-polyfill';

Vue.use(Bootstrap);
Vue.use(VueResource);
Vue.use(VeeValidate);
VeeValidate.Validator.localize('en', campaignDictionary);

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true
});
Vue.use(BootstrapVue);
Vue.use(Croppa);
Vue.use(interceptors);
Vue.use(elementUi);

/**
 * If the campaign has just been processed redirect to the dashboard
 */
const searchParams = new URLSearchParams(window.location.search);
const processed = searchParams.get('processed');

if (processed === 'true') {
  window.location.href = '/#finished-campaign';
}

const app = new Vue({
  store,
  components: {
    Campaign,
  },
  comments: true,
}).$mount('#campaign');
