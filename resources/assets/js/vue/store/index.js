import Vue from 'vue/dist/vue'
import Vuex from 'vuex/dist/vuex'
import _ from 'underscore'
import campaignService from '../services/campaign'
Vue.use(Vuex);

const state = {
  campaign: {},
  modules: [],
  editedModules: [],
  editedSettings: {}
};

const getters = {
  getModules (state) {
    return state.modules;
  }
};

const mutations = {
  loadCampaignData (state, campaignData) {
    state.campaign = campaignData;
    state.modules = campaignData.campaign_data.modules_data;
  },
  addModule (state, moduleData) {
    state.modules.push(moduleData);
  },
  updateElement (state, edited) {
    let matches = _.where(state.editedModules, {
      moduleId: edited.moduleId,
      columnId: edited.columnId,
      componentId: edited.componentId
    });

    if (matches.length) {
      matches[0].data = _.extend(matches[0].data, edited.data)
    } else {
      state.editedModules.push(edited);
    }
  },
  saveSettings (state, settings) {
    state.editedSettings = settings;
  },
  error (err) {
    console.error(err);
  }
};

const actions = {
  getCampaignData (context) {
    return campaignService.getCampaign()
      .then((response) => context.commit('loadCampaignData', response))
      .catch((error) => context.commit('error', error));
  },
  saveCampaign (context) {
    return campaignService.saveCampaign()
      .then((response) => response)
      .catch((error) => context.commit('error', error));
  }
};

let store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});

export default store;