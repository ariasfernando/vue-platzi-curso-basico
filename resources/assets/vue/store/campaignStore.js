import _ from 'lodash';
import uc from 'underscore-contrib';
import Q from 'q';
import campaignService from '../services/campaign';

const state = {
  campaign: {},
  modules: [],
  editedModules: [],
  editedSettings: {},
  currentComponent: {},
  modalComplete: false,
  modalPreview: false,
  modalProof: false,
  buildingMode: 'desktop',
  editorToolbar: '',
  dirty: false,
};

const getters = {
  modules(state) {
    return state.modules;
  },
  campaign(state) {
    return state.campaign;
  },
  currentComponent(state) {
    return state.currentComponent;
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
  editorToolbar(state) {
    return state.editorToolbar;
  },
  dirty(state) {
    return state.dirty;
  },
};

const mutations = {
  loadCampaignData(state, campaignData) {
    state.campaign = campaignData;
    state.modules = campaignData.campaign_data.modules_data;
  },
  updateEmailCanvas(state, modules_data) {
    state.modules = modules_data;
  },
  changeBuildingMode(state, buildingMode) {
    state.buildingMode = buildingMode;
  },
  setDirty(state, dirty) {
    state.dirty = dirty;
  },
  addModule(state, moduleData) {
    state.modules.push(moduleData);
  },
  cloneModule(state, moduleId) {
    const clone = _.cloneDeep(state.modules[moduleId]);
    state.modules.push(clone);
  },
  updateComponentData(state, edited) {
    for (const key in edited.data) {
      state.modules[edited.moduleId].structure.columns[edited.columnId].components[edited.componentId][key] = edited.data[key];
    }
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
  setProcessStatus(state, processed = true) {
    state.campaign.campaign_data.processed = processed;
  },
  setCurrentComponent(state, data) {
    state.currentComponent = data;
  },
  saveComponent(state, data) {
    const moduleId = data.moduleId;
    const columnId = data.columnId;
    const componentId = data.componentId;
    state.modules[moduleId].structure.columns[columnId].components[componentId] = data.component;
  },
  savePlugin(state, data) {
    let pluginData = state.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].data;
    _.merge(pluginData, data.data);
  },
  saveComponentAttribute(state, data) {
    let attributes = state.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId].attribute;
    attributes[data.attribute] = data.attributeValue;
  },
  setEditorOptions(state, toolbar) {
    state.editorToolbar = toolbar;
  },
  error(err) {
    console.error(err);
  },
};

const actions = {
  getCampaignData(context, campaignId) {
    return campaignService.getCampaign(campaignId)
      .then((response) => {
        context.commit('loadCampaignData', response.campaign);
        context.commit('setDirty', false);
      })
      .catch(error => context.commit('error', error));
  },
  saveCampaign(context, data) {
    const deferred = Q.defer();
    campaignService.saveCampaign(data)
      .then(res => {
        context.dispatch('getCampaignData', res.campaignId);
        deferred.resolve(res.campaignId);
      })
      .catch(error => {
        context.commit('error', error);
        deferred.reject(error);
      });
    return deferred.promise;
  },
  completeCampaign(context, campaign) {
    const deferred = Q.defer();
    campaignService.completeCampaign(campaign)
      .then(response => {
        context.dispatch('getCampaignData', response.campaignId);
        deferred.resolve(response);
      })
      .catch(error => {
        context.commit('error', error);
        deferred.reject(error);
      });
    return deferred.promise;
  },
  updateElement(context, edited) {
    context.commit('setDirty', true);
    context.commit('updateComponentData', edited);
  },
  sendPreview(context, data) {
    return campaignService.sendPreview(data)
      .then(res => context.dispatch('getCampaignData', res.campaignId))
      .catch(error => context.commit('error', error));
  },
  removeModule(context, moduleId) {
    context.commit('removeModule', moduleId);
  },
};

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
