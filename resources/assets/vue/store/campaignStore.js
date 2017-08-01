import _ from 'lodash';
import uc from 'underscore-contrib';
import campaignService from '../services/campaign';

const state = {
  campaign: {},
  modules: [],
  editedModules: [],
  editedSettings: {},
  modalComplete: false,
  modalPreview: false,
  buildingMode: 'desktop',
};

const getters = {
  getModules(state) {
    return state.modules;
  },
  templateWidth(state) {
    const templateWidth = 600;
    const templateMobileWidth = 480;
    if (_.isEmpty(state.campaign)) {
      return state.buildingMode === 'desktop' ? templateWidth : templateMobileWidth;
    }
    if (state.buildingMode === 'mobile') {
      return state.campaign.library_config.templateMobileWidth || templateMobileWidth;
    }
    return state.campaign.library_config.templateWidth || templateWidth;
  },
};

const mutations = {
  loadCampaignData(state, campaignData) {
    state.campaign = campaignData;
    state.modules = campaignData.campaign_data.modules_data;
  },
  changeBuildingMode(state, buildingMode) {
    state.buildingMode = buildingMode;
  },
  addModule(state, moduleData) {
    state.modules.push(moduleData);
  },
  cloneModule(state, moduleId) {
    const clone = _.cloneDeep(state.modules[moduleId]);
    state.modules.push(clone);
  },
  addEditedModule(state, edited) {
    state.editedModules.push(edited);
  },
  updateEditedModule(state, edited) {
    const matches = uc.where(state.editedModules, {
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
  removeModule(state, moduleId) {
    state.modules.splice(moduleId, 1);
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
      .then(campaignId => context.dispatch('getCampaignData', campaignId))
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
  sendPreview(context, data) {
    return campaignService.sendPreview(data)
      .then(res => context.dispatch('getCampaignData', res.campaignId))
      .catch(error => context.commit('error', error));
  },
};

module.exports = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};