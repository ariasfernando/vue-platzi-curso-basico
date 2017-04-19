import Vue from 'vue/dist/vue'
import Vuex from 'vuex/dist/vuex'
Vue.use(Vuex);

// Modules
import libraryStore from './libraryStore'
import moduleStore from './moduleStore'
import campaignStore from './campaignStore'

let store = new Vuex.Store({
  modules: {
    library: libraryStore,
    module: moduleStore,
    campaign: campaignStore
  }
});

export default store;