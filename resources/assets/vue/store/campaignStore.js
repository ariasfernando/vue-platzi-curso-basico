import _ from 'underscore-contrib';
import campaignService from '../services/campaign';

const state = {
  campaign: {},
  modules: [],
  editedModules: [],
  editedSettings: {},
  modalComplete: false,
};

const getters = {
  getModules(state) {
    return state.modules;
  },
};

const mutations = {
  loadCampaignData(state, campaignData) {
    state.campaign = campaignData;
    state.modules = campaignData.campaign_data.modules_data;
  },
  addModule(state, moduleData) {
    state.modules.push(moduleData);
  },
  addEditedModule(state, edited) {
    state.editedModules.push(edited);
  },
  updateEditedModule(state, edited) {
    const matches = _.where(state.editedModules, {
      moduleId: edited.moduleId,
      columnId: edited.columnId,
      componentId: edited.componentId,
    });
    matches[0].data = _.extend(matches[0].data, edited.data);
  },
  saveSetting(state, setting) {
    state.editedSettings[setting.name] = setting.value;
  },
  toggleModal(state, modalName) {
    state[modalName] = !state[modalName];
  },
  error(err) {
    console.error(err);
  },
};

const actions = {
  getCampaignData(context, campaignId) {
    return campaignService.getCampaign(campaignId)
      .then(response => context.commit('loadCampaignData', response.campaign))
      .catch(error => context.commit('error', error));
  },
  saveCampaign(context, data) {
    return campaignService.saveCampaign(data)
      .then(res => context.dispatch('getCampaignData', res.campaignId))
      .catch(error => context.commit('error', error));
  },
  completeCampaign(context, data) {
    return campaignService.completeCampaign(data)
      .then(res => context.dispatch('getCampaignData', res.campaignId))
      .catch(error => context.commit('error', error));
  },
  updateElement(context, edited) {
    const matches = _.where(state.editedModules, {
      moduleId: edited.moduleId,
      columnId: edited.columnId,
      componentId: edited.componentId,
    });

    if (matches.length) {
      context.commit('updateEditedModule', edited);
    } else {
      context.commit('addEditedModule', edited);
    }
  },
};

module.exports = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};