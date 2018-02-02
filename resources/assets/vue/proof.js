/*
 | ==================================================================
 |  Proof Vue Components
 | ==================================================================
 |
 | This file contains all the vue components regarding Proof.
 |
 | ------------------------------------------------------------------
 */

import Vue from 'vue/dist/vue';
import VueResource from 'vue-resource/dist/vue-resource';
import Toast from 'vue-easy-toast';

Vue.use(VueResource);

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  parent: 'body',
  transition: 'fade',
  duration: 5000,
  closeable: true
});

import ProofViewer from './components/proof/ProofViewer.vue';

var vm = new Vue({
    el: '#proof',

    components: {
        ProofViewer
    },

    ready() {
        //
    }
}).$mount('#proof');
