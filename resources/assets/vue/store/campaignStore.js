/* eslint no-console:0 */
import Vue from 'vue';

import {
  defer,
} from 'q';
import clone from 'clone';
import campaignService from '../services/campaign';
import imageService from '../services/image';

const convertArrayToObject = (element, { subComponent, link }) => {
  const valueToConvert = subComponent !== undefined && link !== undefined ? element[subComponent] : element;
  const lastPosition = link === undefined ? subComponent : link;
  Vue.set(valueToConvert, lastPosition, {});
  return valueToConvert[lastPosition];
};

const getElement = (module, elementId) => {
  let element = false;
  _.forEach(module.structure.columns, (column) => {
    if (column.id === elementId) {
      element = column;
      return false;
    }
    _.forEach(column.components, (CurrentComponent) => {
      if (CurrentComponent.id === elementId) {
        element = CurrentComponent;
        return false;
      }
      return true;
    });
    return !element;
  });
  return element;
};

const getModule = (modules, idInstance) => {
  let module = false;
  _.forEach(modules, (currentModule) => {
    if (currentModule.idInstance === idInstance) {
      module = currentModule;
      return false;
    }
    return true;
  });
  return module;
};

const getProperties = (element, { subComponent, link }) => {
  const subElement = subComponent ? element[subComponent] : element;
  return link ? subElement[link] : subElement;
};

const searchOrCreateLevel = (data, keys) => {
  let subData = data;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!_.has(subData, [keys[i]])) {
      Vue.set(subData, [keys[i]], {});
    }
    subData = subData[keys[i]];
  }
  return {
    data: subData,
    property: keys[keys.length - 1],
  };
};

function campaignStore() {
  return {
    namespaced: true,
    state: {
      campaign: {},
      modules: [],
      editedSettings: {},
      campaignValidated: false,
      currentModuleId: undefined,
      currentCustomModuleId: undefined,
      currentComponent: {},
      currentCustomComponent: {},
      activeModule: undefined,
      modalCode: false,
      modalComplete: false,
      modalPreview: false,
      modalProof: false,
      modalProofTrack: false,
      modalEnableTemplating: false,
      modalEsp: false,
      modalLiveClicker: false,
      buildingMode: 'desktop',
      editorToolbar: '',
      dirty: false,
      showImageEditor: false,
      fieldErrors: [],
      showModuleSettings: false,
      processing: false,
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
        const errors = _.filter(modules, m => (!_.isEmpty(m.data) && m.data.errors && m.data.errors.length));
        return errors.length > 0;
      },
      getModuleErrors(state) {
        const modules = state.modules;
        const errors = _.filter(modules, m => (!_.isEmpty(m.data) && m.data.errors && m.data.errors.length));
        return errors;
      },
      fieldErrors(state) {
        return state.fieldErrors;
      },
      editedSettings(state) {
        return state.editedSettings;
      },
      currentComponent(state) {
        return state.currentComponent;
      },
      currentCustomComponent(state) {
        return state.currentCustomComponent;
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
      isProcessing(state) {
        return state.processing;
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
      libraryConfig(state) {
        return state.campaign.library_config;
      },
    },
    mutations: {
      campaignValidated(state, status) {
        state.campaignValidated = status;
      },
      campaignCanBeProcessed(state, status) {
        state.campaign.campaign_data.can_be_processed = status;
      },
      loadCampaignData(state, campaignData) {
        state.campaign = campaignData;
        state.modules = campaignData.campaign_data.modules_data;
      },
      updateEmailCanvas(state, modulesData) {
        state.modules = modulesData;
      },
      changeBuildingMode(state, buildingMode) {
        state.buildingMode = buildingMode;
      },
      setDirty(state, dirty) {
        if (state.processing === false) {
          state.dirty = dirty;
        } else {
          state.dirty = false;
        }
      },
      setUpdatedAt(state, updatedAt) {
        state.campaign.campaign_data.updated_at = updatedAt;
      },
      setToggleImageEditor(state, stateModal) {
        state.showImageEditor = stateModal;
      },
      setToggleModuleSettings(state, toggleValue) {
        state.showModuleSettings = toggleValue;
      },
      addModule(state, moduleData) {
        state.modules.push(moduleData);
        this.commit('campaign/setDirty', true);
      },
      insertModule(state, { index, moduleData }) {
        state.modules.splice(index, 0, moduleData);
        this.commit('campaign/setDirty', true);
      },
      cloneModule(state, moduleId) {
        const cloned = _.cloneDeep(state.modules[moduleId]);
        cloned.idInstance = Math.floor(100000 + (Math.random() * 900000));
        state.modules.push(cloned);
        this.commit('campaign/setDirty', true);
      },
      updateCustomElement(state, payload) {
        // DEPRECATED
        if (!_.isUndefined(payload.moduleId)) {
          const update = { ...state.modules[payload.moduleId].data, ...payload.data };
          state.modules[payload.moduleId].data = update;
          this.commit('campaign/setDirty', true);
        }
      },
      updateCustomElementProperty(state, payload) {
        if (!_.isUndefined(payload.moduleId)) {
          const dataComponent = state.modules[payload.moduleId].data;
          const subComponent = payload.subComponent ? dataComponent[payload.subComponent] : dataComponent;
          Vue.set(subComponent, payload.property, payload.value);
          this.commit('campaign/setDirty', true);
        } else {
          throw new Error('moduleId is undefined');
        }
      },
      saveSetting(state, { name, value }) {
        Vue.set(state.editedSettings, name, value);
        this.commit('campaign/setDirty', true);
      },
      saveCampaignData(state, payload) {
        const update = {};
        update[payload.name] = payload.value;
        const newData = _.extend(clone(state.campaign.campaign_data), update);

        state.campaign.campaign_data = newData;
      },
      toggleModal(state, modalName) {
        state[modalName] = !state[modalName];
      },
      removeModule(state, moduleId) {
        state.modules.splice(moduleId, 1);
        this.commit('campaign/setDirty', true);
      },
      setProcessingStatus(state, processing = true) {
        state.processing = processing;
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
      setCurrentCustomComponent(state, data) {
        state.currentCustomComponent = data;
      },
      unsetCurrentCustomComponent(state) {
        state.currentCustomComponent = {};
      },
      setActiveModule(state, moduleId) {
        state.activeModule = moduleId;
      },
      unsetActiveModule(state) {
        state.activeModule = undefined;
      },
      setActiveLastModule(state) {
        state.activeModule = state.modules.length - 1;
      },
      saveComponent(state, data) {
        const moduleId = data.moduleId;
        const columnId = data.columnId;
        const componentId = data.componentId;
        state.modules[moduleId].structure.columns[columnId].components[componentId] = data.component;
        this.commit('campaign/setDirty', true);
      },
      savePlugin(state, payload) {
        let plugin = state.modules[payload.moduleId];
        if (payload.componentId >= 0) {
          // save component plugin
          plugin = plugin.structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin];
        } else if (payload.columnId >= 0) {
          // save column plugin
          plugin = plugin.structure.columns[payload.columnId].plugins[payload.plugin];
        } else {
          // save module plugin
          plugin = plugin.plugins[payload.plugin];
        }
        plugin.data = {
          ...plugin.data,
          ...payload.data,
        };
        this.commit('campaign/setDirty', true);
      },
      saveElementProperty(state, { moduleIdInstance, elementId, property, value, ...scope }) {
        const module = getModule(state.modules, moduleIdInstance);
        const element = elementId === undefined ? module.structure : getElement(module, elementId);
        let properties = getProperties(element, scope);
        if (Array.isArray(properties) && isNaN(property)) {
          // prevent using named indexes on Array (sometimes the backend returns a array instead of a object.
          properties = convertArrayToObject(element, scope);
        }
        Vue.set(properties, property, value);
        this.commit('campaign/setDirty', true);
      },
      saveElementPluginData(state, { moduleIdInstance, elementId, type, plugin, path, value }) {
        const module = getModule(state.modules, moduleIdInstance);
        const element = elementId === undefined ? module : getElement(module, elementId);
        const pluginData = element.plugins[plugin];
        const pathArray = _.concat([type || 'data'], path ? path.split('.') : []);
        const pluginOption = searchOrCreateLevel(pluginData, pathArray);
        Vue.set(pluginOption.data, pluginOption.property, value);
      },
      saveComponentProperty(state, data) {
        // DEPRECATE, use saveElementProperty
        const component = state.modules[data.moduleId].structure.columns[data.columnId].components[data.componentId];
        const subComponent = data.subComponent ? component[data.subComponent] : component;
        const properties = data.link ? subComponent[data.link] : subComponent;
        Vue.set(properties, data.property, data.value);
        this.commit('campaign/setDirty', true);
      },
      saveColumnAttribute(state, data) {
        // DEPRECATE
        const attributes = state.modules[data.moduleId].structure.columns[data.columnId].container.attribute;
        const newData = {};
        newData[data.attribute] = data.attributeValue;
        state
          .modules[data.moduleId]
          .structure.columns[data.columnId]
          .container.attribute = { ...attributes, ...newData };
        this.commit('campaign/setDirty', true);
      },
      saveColumnProperty(state, data) {
        const columns = state.modules[data.moduleId].structure.columns;
        const column = columns[data.columnId];
        const columnClone = _.cloneDeep(column);
        const subComponent = data.subComponent ? column[data.subComponent] : column;
        const properties = data.link ? subComponent[data.link] : subComponent;
        Vue.set(properties, data.property, data.value);
        this.commit('campaign/setDirty', true);
        // hack to make the column array reactive
        // note: for more info check vue documentation #Array-Change-Detection
        if (!_.isEqual(columnClone, column)) {
          Vue.set(columns, data.columnId, column);
        }
      },
      saveModuleAttribute(state, data) {
        // DEPRECATE
        const attributes = state.modules[data.moduleId].structure.attribute;
        attributes[data.attribute] = data.attributeValue;
        this.commit('campaign/setDirty', true);
      },
      saveModuleProperty(state, data) {
        const module = state.modules[data.moduleId].structure;
        const properties = data.link ? module[data.link] : module;
        Vue.set(properties, data.property, data.value);
        this.commit('campaign/setDirty', true);
      },
      saveModuleData(state, data) {
        // TODO: Migrate saveCustomModuleData to this method
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data = {};
        }

        // This workaround is because Vue cannot react on changes when you set an item inside an array with its index
        const newData = _.extend(clone(state.modules[data.moduleId].data), data.data);
        state.modules[data.moduleId].data = newData;
        this.commit('campaign/setDirty', true);
      },
      saveCustomModuleData(state, data) {
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[data.moduleId].data)) {
          Vue.set(state.modules[data.moduleId], 'data', {});
        }

        // This workaround is because Vue cannot react on changes when you set an item inside an array with its index
        const newData = _.extend(clone(state.modules[data.moduleId].data), data.data);
        Vue.set(state.modules[data.moduleId], 'data', newData);
        this.commit('campaign/setDirty', true);
      },
      saveCustomModuleImageData(state, data) {
        if (_.isArray(state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data = {};
        }
        if (!state.modules[data.moduleId].data.images) {
          state.modules[data.moduleId].data.images = {};
        }
        if (!state.modules[data.moduleId].data.images[data.key]) {
          state.modules[data.moduleId].data.images[data.key] = {};
        }
        if (!state.modules[data.moduleId].data.images[data.key][data.field]) {
          state.modules[data.moduleId].data.images[data.key][data.field] = {};
        }
        Vue.set(state.modules[data.moduleId].data.images[data.key], data.field, data.value);
      },
      saveCustomModuleDataFieldByIndex(state, data) {
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data = {};
        }

        if (!(data.field in state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data[data.field] = [];
        }

        if (!(data.index in state.modules[data.moduleId].data[data.field])) {
          state.modules[data.moduleId].data[data.field][data.index] = {};
        }

        const newData = _.extend(clone(state.modules[data.moduleId].data[data.field][data.index]), data.value);
        state.modules[data.moduleId].data[data.field][data.index] = newData;
        state.modules[data.moduleId].data[data.field] = clone(state.modules[data.moduleId].data[data.field]);
        this.commit('campaign/setDirty', true);
      },
      saveCustomModuleDataField(state, data) {
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data = {};
        }
        if (!(data.field in state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data[data.field] = {};
        }

        if (!(data.field in state.modules[data.moduleId].data)) {
          state.modules[data.moduleId].data[data.field] = {};
        }

        if ('merge' in data && data.merge === true) {
          const newData = _.extend(clone(state.modules[data.moduleId].data[data.field]), data.value);
          state.modules[data.moduleId].data[data.field] = newData;
        } else {
          state.modules[data.moduleId].data[data.field] = data.value;
        }

        this.commit('campaign/setDirty', true);
      },
      saveCustomModuleParamsField(state, param) {
        // Prevent empty arrays returned by php-mongo
        if (_.isArray(state.modules[param.moduleId].params)) {
          Vue.set(state.modules[param.moduleId], 'params', {});
        }
        if (!(param.field in state.modules[param.moduleId].params)) {
          Vue.set(state.modules[param.moduleId].params, param.field, {});
        }
        if ('merge' in param && param.merge === true) {
          const newParams = _.extend(clone(state.modules[param.moduleId].params[param.field]), param.value);
          Vue.set(state.modules[param.moduleId].params, param.field, newParams);
        } else {
          Vue.set(state.modules[param.moduleId].params, param.field, param.value);
        }
        this.commit('campaign/setDirty', true);
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
        if (_.has(state.modules[moduleId].data, 'errors')) {
          const filtered = state.fieldErrors.filter(err => err.scope.clearErrorsByModuleId !== moduleId);
          state.fieldErrors = filtered;
          Vue.set(state.modules[moduleId].data, 'errors', []);
        }
      },
      clearErrorsByScope(state, scope) {
        const moduleErrors = state.modules[scope.moduleId].data.errors || [];
        let filtered = () => {};
        if (scope.type === 'custom') {
          filtered = moduleErrors.filter(err => !(_.isEqual(err.scope.elementName, scope.elementName)
            && _.isEqual(err.scope.idInstance, scope.idInstance)));
        } else {
          filtered = moduleErrors.filter(err => !(_.isEqual(err.scope.name, scope.name)
            && _.isEqual(err.scope.columnId, scope.columnId)
            && _.isEqual(err.scope.componentId, scope.componentId)));
        }
        Vue.set(state.modules[scope.moduleId].data, 'errors', filtered);
      },
      setCampaignName(state, campaignName) {
        Vue.set(state.campaign.campaign_data, 'campaign_name', campaignName);
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
      updateText(context, payload) {
        context.commit('saveComponentProperty', payload);
        if (payload.sync !== false) {
          payload.property = 'textDirty';
          payload.value = Math.floor(100000 + (Math.random() * 900000));
          context.commit('saveComponentProperty', payload);
        }
      },
      updateCustomElementProperty(context, payload) {
        context.commit('updateCustomElementProperty', payload);
        return Promise.resolve();
      },
      addErrors(context, errors) {
        _.each(errors, (error) => {
          // Get module errors
          const moduleErrors = _.cloneDeep(context.state.modules[error.scope.moduleId].data.errors) || [];

          let moduleErrorsByField = [];
          if (error.scope.type === 'custom') {
            // Remove generic errors (workaround introduced in SV2-638).
            // This will be removed when a final solution for validations is in place.
            const indexToRemove = moduleErrors.findIndex(
              err => (_.isEqual(err.scope.elementName, error.scope.elementName)
                && _.isEqual(err.scope.idInstance, error.scope.idInstance)
                && _.isUndefined(err.scope.msg)
              ));
            if (indexToRemove >= 0) {
              moduleErrors.splice(indexToRemove, 1);
            }

            moduleErrorsByField = moduleErrors.filter(
              err => (_.isEqual(err.scope.elementName, error.scope.elementName)
                && _.isEqual(err.scope.idInstance, error.scope.idInstance)
                && _.isEqual(err.scope.msg, error.scope.msg)
              ));
          } else {
            // Remove generic errors (workaround introduced in SV2-638)
            // This will be removed when a final solution for validations is in place.
            const indexToRemove = moduleErrors.findIndex(
              err => (_.isEqual(err.scope.name, error.scope.name)
                && _.isEqual(err.scope.columnId, error.scope.columnId)
                && _.isEqual(err.scope.componentId, error.scope.componentId)
                && _.isUndefined(err.scope.msg)
              ));
            if (indexToRemove >= 0) {
              moduleErrors.splice(indexToRemove, 1);
            }

            moduleErrorsByField = moduleErrors.filter(
              err => (_.isEqual(err.scope.name, error.scope.name)
                && _.isEqual(err.scope.columnId, error.scope.columnId)
                && _.isEqual(err.scope.componentId, error.scope.componentId)
                && _.isEqual(err.scope.msg, error.scope.msg)
              ));
          }
          // Check if error already exists
          if (moduleErrorsByField.length === 0) {
            // Add error
            moduleErrors.push(error);
            // Save module data
            context.commit('saveModuleData', {
              moduleId: error.scope.moduleId,
              data: { errors: moduleErrors },
            });
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
            const campaign = response.campaign;
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
        const deferred = defer();
        campaignService.saveCampaign(data)
          .then((res) => {
            context.commit('setDirty', false);
            context.commit('setUpdatedAt', res.updatedAt);
            deferred.resolve(res.campaignId);
          })
          .catch((error) => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      completeCampaign(context, campaign) {
        const deferred = defer();
        campaignService.completeCampaign(campaign)
          .then((response) => {
            context.commit('setDirty', false);
            context.dispatch('getCampaignData', response.campaignId);
            deferred.resolve(response);
          })
          .catch((error) => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      lockCampaign(context, campaignId) {
        const deferred = defer();

        campaignService.lockCampaign(campaignId)
          .then((response) => {
            context.dispatch('getCampaignData', response.campaign_id);
            deferred.resolve(response);
          })
          .catch((error) => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      unlockCampaign(context, campaignId) {
        const deferred = defer();

        campaignService.unlockCampaign(campaignId)
          .then((response) => {
            context.dispatch('getCampaignData', response.campaign_id);
            deferred.resolve(response);
          })
          .catch((error) => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      pingLockCampaign(context, data) {
        const deferred = defer();

        campaignService.pingLock({ campaignId: data.campaignId, windowId: data.windowId })
          .then(() => {})
          .catch((error) => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      favoriteCampaign(context, campaignId) {
        const deferred = defer();

        campaignService.favoriteCampaign(campaignId)
          .then((response) => {
            context.dispatch('getCampaignData', response.campaign_id);
            deferred.resolve(response);
          })
          .catch((error) => {
            context.commit('error', error);
            deferred.reject(error);
          });
        return deferred.promise;
      },
      uploadImages(context, data) {
        const deferred = defer();

        imageService.uploadImages(data)
          .then((images) => {
            // override with full path
            _.each(images, (image, key) => {
              images[key] = `campaigns${image}`;
            });
            deferred.resolve(images);
          })
          .catch((error) => {
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
      },
    },
  };
}

module.exports = campaignStore();
