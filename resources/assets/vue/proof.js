/*
 | ==================================================================
 |  Proof Vue Components
 | ==================================================================
 |
 | This file contains all the vue components regarding Proof.
 |
 | ------------------------------------------------------------------
 */

import Vue from 'vue';
import VueResource from 'vue-resource/dist/vue-resource';
import interceptors from './interceptors';
import Toast from 'vue-easy-toast';
import Bootstrap from './bootstrap';
import BootstrapVue from 'bootstrap-vue';

Vue.use(Bootstrap);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(interceptors);

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true
});

import ProofViewer from './components/proof/ProofViewer.vue';

const vm = new Vue({
  components: {
    ProofViewer
  }
}).$mount('#proof');
