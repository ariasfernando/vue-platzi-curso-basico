import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import apiStore from './apiStore';
import campaignStore from './campaignStore';
import configStore from './configStore';
import globalStore from './globalStore';
import libraryStore from './libraryStore';
import moduleStore from './moduleStore';
import settingStore from './settingStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  modules: {
    api: apiStore,
    campaign: campaignStore,
    config: configStore,
    global: globalStore,
    library: libraryStore,
    module: moduleStore,
    setting: settingStore,
  },
});

export default store;
