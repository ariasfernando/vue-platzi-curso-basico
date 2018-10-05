import Vue from 'vue';
import Vuex from 'vuex/dist/vuex';
Vue.use(Vuex);

// Modules
import globalStore from './globalStore';
import libraryStore from './libraryStore';
import moduleStore from './moduleStore';
import campaignStore from './campaignStore';
import apiStore from './apiStore';
import configStore from './configStore';

const store = new Vuex.Store({
  strict: true,
  modules: {
    api: apiStore,
    global: globalStore,
    library: libraryStore,
    module: moduleStore,
    campaign: campaignStore,
    config: configStore,
  },
});

export default store;
