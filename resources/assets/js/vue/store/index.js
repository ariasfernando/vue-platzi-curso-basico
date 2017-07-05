import Vue from 'vue/dist/vue';
import Vuex from 'vuex/dist/vuex';
Vue.use(Vuex);

// Modules
import globalStore from './globalStore';
import libraryStore from './libraryStore';
import moduleStore from './moduleStore';
import campaignStore from './campaignStore';

const store = new Vuex.Store({
  modules: {
    global: globalStore,
    library: libraryStore,
    module: moduleStore,
    campaign: campaignStore,
  },
});

export default store;