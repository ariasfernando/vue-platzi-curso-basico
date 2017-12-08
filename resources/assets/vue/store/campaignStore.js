import Vue from 'vue/dist/vue';
import _ from 'lodash';
import Q from 'q';
import clone from 'clone';
import campaignService from '../services/campaign';
import imageService from '../services/image';

function campaignStore() {
  return {
    namespaced: true,
    state: {
      campaign: {},
      modules: [],
      editedSettings: {},
      currentModuleId: undefined,
      currentCustomModuleId: undefined,
      currentComponent: {},
      modalCode: false,
      modalComplete: false,
      modalPreview: false,
      modalProof: false,
      modalEnableTemplating: false,
      buildingMode: 'desktop',
      editorToolbar: '',
      dirty: false,
    },
    getters: {
      modules(state) {
        return state.modules;
      },
      campaign(state) {
        return state.campaign;
      },
      currentComponent(state) {
        return state.currentComponent;
      },
      currentModule(state) {
        return state.currentModuleId;
      },
      currentCustomModule(state) {
        return state.currentCustomModuleId;
      },
      buildingMode(state) {
        return state.buildingMode;
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
      locked(state) {
        if (!_.isEmpty(state.campaign)) {
          return state.campaign.campaign_data.locked;
        }
        return false;
      },
    },
    mutations: {
      loadCampaignData(state, campaignData) {
        state.campaign = campaignData;
        state.modules = campaignData.campaign_data.modules_data;
        state.editedSettings.autoSave = campaignData.campaign_data.auto_save;
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
      setCustomModule(state, moduleId) {
        state.currentCustomModuleId = moduleId;
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
        state.currentModuleId = undefined;
      },
      saveComponent(state, data) {
        const moduleId = data.moduleId;
        const columnId = data.columnId;
        const componentId = data.componentId;
        state.modules[moduleId].structure.columns[columnId].components[componentId] = data.component;
      },
      savePlugin(state, payload) {
        const originalData = state.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].data;
        const updated = { ...originalData, ...payload.data };
        state.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].data = updated;
      },
      saveComponentAttribute(state, data) {
        const attributes = state.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId].attribute;
        attributes[data.attribute] = data.attributeValue;
      },
      saveColumnAttribute(state, data) {
        const attributes = state.modules[data.moduleId].structure.columns[data.columnId].attribute;
        attributes[data.attribute] = data.attributeValue;
      },
      saveModuleAttribute(state, data) {
        const attributes = state.modules[data.moduleId].structure.attribute;
        attributes[data.attribute] = data.attributeValue;
      },
      saveCustomModuleData(state, data) {
        // This workaround is because Vue cannot react on changes when you set an item inside an array with its index
        const newData = _.extend(clone(state.modules[data.moduleId].data), data.data);
        state.modules[data.moduleId].data = newData;
      },
      saveCustomModuleDataField(state, data) {
        state.modules[data.moduleId].data[data.field] = data.value;
      },
      setEditorOptions(state, toolbar) {
        state.editorToolbar = toolbar;
      },
      setCurrentModule(state, moduleId) {
        state.currentModuleId = moduleId;
        state.currentComponent = {};
      },
      setTemplating(state, templating) {
        state.campaign.campaign_data.template = templating;
      },
      error(err) {
        console.error(err);
      },
    },
    actions: {
      saveCustomModuleData(context, data) {
        _.each(data.data, (value, field) => {
          context.commit('saveCustomModuleDataField', {
            moduleId: data.moduleId,
            field,
            value,
          });
        });
      },
      getCampaignData(context, campaignId) {
        return campaignService.getCampaign(campaignId)
          .then((response) => {
            context.commit('loadCampaignData', response.campaign);
            context.commit('setDirty', false);
          })
          .catch(error => context.commit('error', error));
      },
      getCampaignDataPublic(context, campaignId) {
        return campaignService.getCampaignPublic(campaignId)
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
      lockCampaign(context, campaignId) {
        const deferred = Q.defer();

        campaignService.lockCampaign(campaignId)
          .then(response => {
            context.dispatch('getCampaignData', response.campaign_id);
            deferred.resolve(response);
          })
          .catch(error => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      unlockCampaign(context, campaignId) {
        const deferred = Q.defer();

        campaignService.unlockCampaign(campaignId)
        .then(response => {
          context.dispatch('getCampaignData', response.campaign_id);
          deferred.resolve(response);
        })
        .catch(error => {
          context.commit('error', error);
          deferred.reject(error);
        });
        return deferred.promise;
      },
      favoriteCampaign(context, campaignId) {
        const deferred = Q.defer();

        campaignService.favoriteCampaign(campaignId)
        .then(response => {
          context.dispatch('getCampaignData', response.campaign_id);
          deferred.resolve(response);
        })
        .catch(error => {
          context.commit('error', error);
          deferred.reject(error);
        });
        return deferred.promise;
      },
      uploadImages(context, data) {
        const deferred = Q.defer();

        imageService.uploadImages(data)
          .then((images) => {
            // override with full path
            _.each(images, (image, key) => {
              images[key] = `campaigns${image}`;
            });
            deferred.resolve(images);
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
        return campaignService.sendPreview(data);
      },
      removeModule(context, moduleId) {
        context.commit('removeModule', moduleId);
      },
    },
  }
};

module.exports = campaignStore();
