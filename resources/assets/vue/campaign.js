import Vue from 'vue';
import VueResource from 'vue-resource/dist/vue-resource';
import VeeValidate from 'vee-validate';
import Toast from 'vue-easy-toast';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import BootstrapVue from 'bootstrap-vue';
import 'url-search-params-polyfill';
import interceptors from './interceptors';
import Bootstrap from './bootstrap';
import store from './store';
import acl from './resources/plugins/acl';
import Campaign from './components/campaign/Campaign.vue';
import { customValidators } from './resources/validator_rules';

Vue.use(Bootstrap);
Vue.use(VueResource);
Vue.use(acl);
Vue.use(VeeValidate);

VeeValidate.Validator.localize('en', Vue.prototype.$_app.dictionary.campaign);

Object.keys(customValidators).forEach((key) => {
  VeeValidate.Validator.extend(key, customValidators[key].method, customValidators[key].options);
});

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true,
});
Vue.use(BootstrapVue);
Vue.use(interceptors);
Vue.use(ElementUI, { locale });

/**
 * If the campaign has just been processed redirect to the dashboard
 */
const searchParams = new URLSearchParams(window.location.search);
const processed = searchParams.get('processed');

if (processed === 'true') {
  window.location.href = '/#finished-campaign';
}

window.vm = new Vue({
  store,
  components: {
    Campaign,
  },
  comments: true,
}).$mount('#campaign');
