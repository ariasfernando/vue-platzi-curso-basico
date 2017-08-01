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

Vue.use(VueResource);

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
