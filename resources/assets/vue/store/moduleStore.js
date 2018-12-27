/* eslint no-param-reassign:0 */
/* eslint no-shadow:0 */
/* eslint no-console:0 */

import Vue from 'vue';
import Q from 'q';
import _ from 'lodash';
import clone from 'clone';
import Element from '../models/Element';
import moduleService from '../services/module';
import imageService from '../services/image';

const state = {
  module: {},
  currentElementId: false,
  buildingMode: 'desktop',
  showRaw: false,
  loading: false,
  secondaryLoading: false,
};

const getColumnIndexByElementId = (elementId) => {
  let columnIndex = false;
  _.forEach(state.module.structure.columns, (column, currentColumnIndex) => {
    if (column.id === elementId) {
      columnIndex = currentColumnIndex;
      return false;
    }
    _.forEach(column.components, (currentComponent) => {
      if (currentComponent.id === elementId) {
        columnIndex = currentColumnIndex;
        return false;
      }
      return true;
    });
    return columnIndex === false;
  });
  return columnIndex;
};
const getComponentIndexByComponentId = (elementId) => {
  let componentIndex = false;
  _.forEach(state.module.structure.columns, (column) => {
    _.forEach(column.components, (currentComponent, currentComponentIndex) => {
      if (currentComponent.id === elementId) {
        componentIndex = currentComponentIndex;
        return false;
      }
      return true;
    });
    return componentIndex === false;
  });
  return componentIndex;
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

const getProperties = (element, data) => {
  const subComponent = data.subComponent ? element[data.subComponent] : element;
  return data.link ? subComponent[data.link] : subComponent;
};

const convertArrayToObject = (element, data) => {
  const valueToConvert =
    data.subComponent !== undefined && data.link !== undefined
      ? element[data.subComponent]
      : element;
  const lastPosition = data.link === undefined ? data.subComponent : data.link;
  Vue.set(valueToConvert, lastPosition, {});
  return valueToConvert[lastPosition];
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

const getters = {
  module(state) {
    return state.module;
  },
  currentComponent(state) {
    if (state.currentElementId) {
      let columnId = getColumnIndexByElementId(state.currentElementId);
      let componentId = getComponentIndexByComponentId(state.currentElementId);
      columnId = columnId === false ? undefined : columnId;
      componentId = componentId === false ? undefined : componentId;
      return {
        columnId,
        componentId,
      };
    }
    return {};
  },
  buildingMode(state) {
    return state.buildingMode;
  },
  showRaw(state) {
    return state.showRaw;
  },
};

const mutations = {
  setLoader(state, data) {
    state.loading = data;
  },
  setSecondaryLoader(state, data) {
    state.secondaryLoading = data;
  },
  setModuleData(state, data) {
    state.module = data;
  },
  setModuleFields(state, data) {
    _.each(data, (value, field) => {
      state.module[field] = value;
    });
  },
  setCurrentComponent(state, data) {
    if (data.componentId >= 0) {
      state.currentElementId =
        state.module.structure.columns[data.columnId].components[
          data.componentId
        ].id;
    } else if (data.columnId >= 0) {
      state.currentElementId = state.module.structure.columns[data.columnId].id;
    } else {
      state.currentElementId = {};
    }
  },
  clearCurrentComponent(state) {
    state.currentComponent = {};
  },
  updateElement(state, payload) {
    const update = {
      ...state.module.structure.columns[payload.columnId].components[
        payload.componentId
      ].data,
      ...payload.data,
    };
    state.module.structure.columns[payload.columnId].components[
      payload.componentId
    ].data = update;
  },
  saveModuleProperty(state, data) {
    const structure = state.module.structure;
    let properties = getProperties(structure, data);
    if (Array.isArray(properties) && isNaN(data.property)) {
      // prevent using named indexes on Array (sometimes the backend returns a array instead of a object.
      properties = convertArrayToObject(structure, data);
    }
    Vue.set(properties, data.property, data.value);
  },
  saveModule(state, moduleId) {
    state.module.moduleId = moduleId;
  },
  addColumn(state, column) {
    state.module.structure.columns.push(column);
  },
  removeColumns(state, data) {
    state.module.structure.columns.splice(data.index, data.number);
  },
  setColumnWidth(state, data) {
    const column = state.module.structure.columns[data.colId];
    // Set attribute
    column.container.attribute.width = `${data.width}%`;
  },
  saveElementProperty(state, { moduleIdInstance, elementId, property, value, ...scope }) {
    const element = elementId === undefined ? state.module : getElement(state.module, elementId);
    if (element.structure) scope.subComponent = 'structure';
    let properties = getProperties(element, scope);
    if (Array.isArray(properties) && isNaN(property)) {
      // prevent using named indexes on Array (sometimes the backend returns a array instead of a object.
      properties = convertArrayToObject(element, scope);
    }
    Vue.set(properties, property, value);
    state.dirty = true;
  },
  saveColumnProperty(state, data) {
    const column = state.module.structure.columns[data.colId];
    let properties = getProperties(column, data);
    if (Array.isArray(properties) && isNaN(data.property)) {
      // prevent using named indexes on Array (sometimes the backend returns a array instead of a object.
      properties = convertArrayToObject(column, data);
    }
    Vue.set(properties, data.property, data.value);
  },
  addComponent(state, data) {
    state.module.structure.columns[data.colId].components.splice(
      data.index,
      0,
      data.el,
    );
  },
  attachPlugins(state, data) {
    state.module.structure.columns[data.colId].components[
      data.componentId
    ].plugins = data.plugins;
  },
  removeElement(state, { elementId }) {
    state.module.structure.columns[
      getColumnIndexByElementId(elementId)
    ].components.splice(
      getComponentIndexByComponentId(elementId),
      1,
    );
  },
  savePlugin(state, payload) {
    let pluginData = state.module;

    if (payload.componentId >= 0) {
      // save component plugin
      pluginData =
        pluginData.structure.columns[payload.columnId].components[
          payload.componentId
        ].plugins[payload.plugin].config;
    } else if (payload.columnId >= 0) {
      // save column plugin
      pluginData =
        pluginData.structure.columns[payload.columnId].plugins[payload.plugin]
          .config;
    } else {
      // save module plugin
      pluginData = pluginData.plugins[payload.plugin].config;
    }
    _.merge(pluginData, payload.config);
  },

  setPluginElementConfig(state, { componentId, type, plugin, path, value }) {
    let component = {};
    if (componentId === undefined) {
      component = state.module;
    } else {
      component = getElement(state.module, componentId);
    }
    const pluginData = component.plugins[plugin];
    const pathArray = _.concat([type || 'config'], path ? path.split('.') : []);
    const pluginOption = searchOrCreateLevel(pluginData, pathArray);
    Vue.set(pluginOption.data, pluginOption.property, value);
  },
  setPluginComponentConfig(state, data) {
    // DEPRECATE
    const plugin =
      state.module.structure.columns[data.columnId].components[data.componentId]
        .plugins[data.plugin];
    const path = _.concat(['config'], data.path ? data.path.split('.') : []);
    const pluginOption = searchOrCreateLevel(plugin, path);
    Vue.set(pluginOption.data, pluginOption.property, data.value);
  },
  savePluginSuboption(state, payload) {
    let pluginOptions = state.module;
    if (payload.componentId >= 0) {
      // save component plugin
      pluginOptions =
        pluginOptions.structure.columns[payload.columnId].components[
          payload.componentId
        ].plugins[payload.plugin].config.options;
    } else if (payload.columnId >= 0) {
      // save column plugin
      pluginOptions =
        pluginOptions.structure.columns[payload.columnId].plugins[
          payload.plugin
        ].config.options;
    } else {
      // save module plugin
      pluginOptions = pluginOptions.plugins[payload.plugin].config.options;
    }
    _.assign(
      pluginOptions[payload.subOption],
      payload.config.options[payload.subOption],
    );
  },
  togglePlugin(state, data) {
    let column = {};
    if (data.columnId >= 0 || data.componentId >= 0) {
      column = state.module.structure.columns[data.columnId];
      if (data.componentId >= 0) {
        column.components[data.componentId].plugins[data.plugin].enabled =
          data.enabled;
      } else {
        column.plugins[data.plugin].enabled = data.enabled;
      }
    } else {
      state.module.plugins[data.plugin].enabled = data.enabled;
    }
    column = null;
  },
  saveComponentProperty(state, data) {
    const component =
      state.module.structure.columns[data.columnId].components[
        data.componentId
      ];
    let properties = getProperties(component, data);
    if (Array.isArray(properties) && isNaN(data.property)) {
      // prevent using named indexes on Array (sometimes the backend returns a array instead of a object.
      properties = convertArrayToObject(component, data);
    }
    Vue.set(properties, data.property, data.value);
  },
  setBuildingMode(state, mode) {
    state.buildingMode = mode;
  },
  setColumnsFixed(state, data) {
    state.module.structure.columnsFixed = data;
  },
  setInvertedStacking(state, data) {
    state.module.structure.invertedStacking = data;
  },
  toggleRaw(state) {
    state.showRaw = !state.showRaw;
  },
  error(state, err) {
    console.error(err);
  },
  setListLibraries(state, data) {
    state.module.structure.columns[data.columnId].components[
      data.componentId
    ].plugins[data.plugin].config.library.config.set_images.options =
      data.response;
    state.module.structure.columns[data.columnId].components[
      data.componentId
    ].plugins[data.plugin].config[
      'sie-plugin-image-overlay_image'
    ].config.overlay_gallery.config.set_images.options = data.response;
  },
};

const actions = {
  addColumn(context) {
    // Get column plugins
    const plugins = {};
    const modulePlugins = Vue.prototype.$_app.modulePlugins;

    _.each(modulePlugins, (plugin, name) => {
      switch (plugin.target.indexOf('column') !== -1) {
        case true:
          plugins[name] = clone(plugin);
          break;
        default:
      }
    });

    // Create new instance of Element width default column data
    const element = new Element({ type: 'column-element', plugins });

    context.commit('addColumn', element.getProperties());
  },
  normalizeColumns(context, columns) {
    const width = 100 / columns.length;
    _.each(columns, (column, colId) => {
      context.commit('setColumnWidth', {
        colId,
        width,
      });
    });
  },
  getModuleData(context, moduleId) {
    if (moduleId) {
      return moduleService.getModule(moduleId)
        .then(response => context.commit('setModuleData', response))
        .catch(error => context.commit('error', error));
    }
    return moduleService.newModule()
      .then(response => context.commit('setModuleData', response))
      .catch(error => context.commit('error', error));
  },
  saveModuleData(context, data) {
    const deferred = Q.defer();

    moduleService.saveModule(data)
      .then((response) => {
        if (response.message && response.message === 'SUCCESS') {
          context.commit('saveModule', response.id);
          deferred.resolve(response.id);
        }
      })
      .catch((error) => {
        context.commit('error', error);
        deferred.reject(error);
      });

    return deferred.promise;
  },
  uploadImages(context, data) {
    const deferred = Q.defer();

    imageService.uploadModuleImages(data)
      .then((response) => {
        deferred.resolve(response);
      })
      .catch((error) => {
        context.commit('error', error);
        deferred.reject(error);
      });

    return deferred.promise;
  },
  updateText(context, payload) {
    context.commit('saveComponentProperty', payload);
    if (payload.sync !== false) {
      payload.property = 'textDirty';
      payload.value = Math.floor(100000 + (Math.random() * 900000));
      context.commit('saveComponentProperty', payload);
    }
  },
  getLibraries(context, data) {
    return imageService.getLibraries().then((response) => {
      response.data.push('');

      context.commit('setListLibraries', {
        ...data,
        response: response.data,
      });
    });
  },
};

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
