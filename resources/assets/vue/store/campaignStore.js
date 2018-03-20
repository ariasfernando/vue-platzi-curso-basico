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
      campaignCompleted: false,
      currentModuleId: undefined,
      currentCustomModuleId: undefined,
      currentComponent: {},
      activeModule: undefined,
      modalCode: false,
      modalComplete: false,
      modalPreview: false,
      modalProof: false,
      modalEnableTemplating: false,
      modalEsp: false,
      buildingMode: 'desktop',
      editorToolbar: '',
      dirty: false,
      showImageEditor: false,
      moduleErrors: [],
      fieldErrors: [],
      showModuleSettings: false,
    },
    getters: {
      modules(state) {
        return state.modules;
      },
      campaign(state) {
        return state.campaign;
      },
      moduleErrors(state) {
        const modules = state.modules;
        const errors = _.filter(modules, m => m.data.errors && m.data.errors.length);

        return errors.length || state.fieldErrors.length;
      },
      fieldErrors(state) {
        return state.fieldErrors;
      },
      currentComponent(state) {
        return state.currentComponent;
      },
      currentModule(state) {
        return state.currentModuleId;
      },
      activeModule(state) {
        return state.activeModule;
      },
      currentCustomModule(state) {
        return state.currentCustomModuleId;
      },
      buildingMode(state) {
        return state.buildingMode;
      },
      templateWidth(state) {
        const templateWidth = 600;
        return (state.campaign.library_config && state.campaign.library_config.templateWidth) || templateWidth;
      },
      editorToolbar(state) {
        return state.editorToolbar;
      },
      dirty(state) {
        return state.dirty;
      },
      showImageEditor(state) {
        return state.showImageEditor;
      },
      showModuleSettings(state) {
        return state.showModuleSettings;
      },
      locked(state) {
        if (!_.isEmpty(state.campaign)) {
          return state.campaign.campaign_data.locked;
        }
        return false;
      },

    },
    mutations: {
      campaignCompleted(state, status) {
        state.campaignCompleted = status;
      },
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
      setToggleImageEditor(state, stateModal) {
        state.showImageEditor = stateModal;
      },
      setToggleModuleSettings(state, toggleValue) {
        state.showModuleSettings = toggleValue;
      },
      addModule(state, moduleData) {
        state.modules.push(moduleData);
        state.dirty = true;
      },
      insertModule(state, {index, moduleData}) {
        state.modules.splice(index, 0, moduleData);
        state.dirty = true;
      },
      cloneModule(state, moduleId) {
        const clone = _.cloneDeep(state.modules[moduleId]);
        state.modules.push(clone);
        state.dirty = true;
      },
      updateCustomElement(state, payload) {
        // This is necessary, since the clickaway function is executed.
        if ( !_.isUndefined(payload.moduleId) ){ 
          const update = { ...state.modules[payload.moduleId].data, ...payload.data };
          state.modules[payload.moduleId].data = update;
          state.dirty = true;
        }
      },
      updateElement(state, payload) {
        // This is necessary, since the clickaway function is executed.
        if ( !_.isUndefined(payload.moduleId) ){ 
          const update = { ...state.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].data, ...payload.data };
          state.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].data = update;
          state.dirty = true;
        }
      },
      saveSetting(state, setting) {
        state.editedSettings[setting.name] = setting.value;
      },
      saveCampaignData(state, payload) {
        state.campaign.campaign_data[payload.name] = payload.value;
      },
      toggleModal(state, modalName) {
        state[modalName] = !state[modalName];
      },
      removeModule(state, moduleId) {
        state.modules.splice(moduleId, 1);
        state.dirty = true;
      },
      setProcessStatus(state, processed = true) {
        state.campaign.campaign_data.processed = processed;
      },
      setCurrentComponent(state, data) {
        state.currentComponent = data;
      },
      unsetCurrentComponent(state) {
        state.currentComponent = {};
      },
      setActiveModule(state, moduleId) {
        state.activeModule = moduleId;
      },
      unsetActiveModule(state) {
        state.activeModule = undefined;
      },
      setActiveLastModule(state) {
        state.activeModule = state.modules.length-1;
      },
      saveComponent(state, data) {
        const moduleId = data.moduleId;
        const columnId = data.columnId;
        const componentId = data.componentId;
        state.modules[moduleId].structure.columns[columnId].components[componentId] = data.component;
        state.dirty = true;
      },
      savePlugin(state, payload) {
        const originalData = state.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].data;
        const updated = { ...originalData, ...payload.data };
        state.modules[payload.moduleId].structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].data = updated;
        state.dirty = true;
      },
      saveComponentStyle(state, data) {
        const component = state.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId];
        component.style[data.property] = data.value;
        state.dirty = true;
      },
      saveComponentAttribute(state, data) {
        const attributes = state.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId].attribute;
        attributes[data.attribute] = data.attributeValue;
        state.dirty = true;
      },
      saveColumnAttribute(state, data) {
        const attributes = state.modules[data.moduleId].structure.columns[data.columnId].attribute;
        attributes[data.attribute] = data.attributeValue;
        state.dirty = true;
      },
      saveModuleAttribute(state, data) {
        const attributes = state.modules[data.moduleId].structure.attribute;
        attributes[data.attribute] = data.attributeValue;
        state.dirty = true;
      },
      saveCustomModuleData(state, data) {
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data = {};
        }

        // This workaround is because Vue cannot react on changes when you set an item inside an array with its index
        const newData = _.extend(clone(state.modules[data.moduleId].data), data.data);
        state.modules[data.moduleId].data = newData;
        state.dirty = true;
      },
      saveCustomModuleDataField(state, data) {
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data = {};
        }

        state.modules[data.moduleId].data[data.field] = data.value;
        state.dirty = true;
      },
      setEditorOptions(state, toolbar) {
        state.editorToolbar = toolbar;
      },
      setCurrentModule(state, moduleId) {
        state.currentModuleId = moduleId;
        state.currentComponent = {};
      },
      unsetCurrentModule(state) {
        state.currentModuleId = undefined;
      },
      setCustomModule(state, moduleId) {
        state.currentCustomModuleId = moduleId;
      },
      unsetCustomModule(state) {
        state.currentCustomModuleId = undefined;
      },
      setTemplating(state, templating) {
        state.campaign.campaign_data.template = templating;
      },
      addError(state, error) {
        state.fieldErrors.push(error);
      },
      clearErrorsByModuleId(state, moduleId) {
        const filtered = state.fieldErrors.filter(err => err.scope.moduleId !== moduleId);
        state.fieldErrors = filtered;
      },
      clearErrorsByScope(state, scope) {
        const filtered = state.fieldErrors.filter(err => !_.isEqual(err.scope, scope));
        state.fieldErrors = filtered;
      },
      error(err) {
        console.error(err);
      },
    },
    actions: {
      updateCustomElement(context, payload) {
        context.commit('updateCustomElement', payload);
        return Promise.resolve();
      },
      addErrors(context, errors) {
        _.each(errors, (error) => {
          context.commit('clearErrorsByScope', error.scope);

          if (context.state.fieldErrors.indexOf(error) === -1) {
            context.commit('addError', error);
          }
        });
      },
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
            let campaign = response.campaign;
            // TODO: use a model
            campaign.campaign_data.auto_save = campaign.campaign_data.auto_save !== false;
            context.commit('loadCampaignData', response.campaign);
          })
          .catch(error => context.commit('error', error));
      },
      getCampaignDataPublic(context, campaignId) {
        return campaignService.getCampaignPublic(campaignId)
          .then((response) => {
            context.commit('loadCampaignData', response.campaign);
          })
          .catch(error => context.commit('error', error));
      },
      saveCampaign(context, data) {
        const deferred = Q.defer();
        campaignService.saveCampaign(data)
          .then(res => {
            context.commit('setDirty', false);
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
            context.commit('setDirty', false);
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
      sendPreview(context, data) {
        return campaignService.sendPreview(data);
      },
      removeModule(context, moduleId) {
        context.commit('removeModule', moduleId);
        context.commit('clearErrorsByModuleId', moduleId);
      },
    },
  };
}

module.exports = campaignStore();
