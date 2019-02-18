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
  draggable: { dragging: false, changed: 0 },
  showRaw: false,
  loading: false,
  secondaryLoading: false,
  moduleHeight: {},
  slideToggles: {},
};

const getColumnIndexByElementId = (module, elementId) => {
  let columnIndex = false;
  _.forEach(module.structure.rows, (row, currentColumnIndex) => {
    _.forEach(row.columns, (column, currentColumnIndex) => {
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
    return columnIndex === false;
  });
  return columnIndex;
};
const getComponentIndexByComponentId = (module, elementId) => {
  let componentIndex = false;
  _.forEach(module.structure.rows, (row) => {
    _.forEach(row.columns, (column) => {
      _.forEach(column.components, (currentComponent, currentComponentIndex) => {
        if (currentComponent.id === elementId) {
          componentIndex = currentComponentIndex;
          return false;
        }
        return true;
      });
      return componentIndex === false;
    });
    return componentIndex === false;
  });
  return componentIndex;
};
const getRowIndexByElementId = (module, elementId) => {
  let rowIndex = false;
  _.forEach(module.structure.rows, (row, currentRowIndex) => {
    _.forEach(row.columns, (currentColumn) => {
      if (currentColumn.id === elementId) {
        rowIndex = currentRowIndex;
        return false;
      }
      _.forEach(currentColumn.components, (currentComponent) => {
        if (currentComponent.id === elementId) {
          rowIndex = currentRowIndex;
          return false;
        }
        return true;
      });
      return rowIndex === false;
    });
    return rowIndex === false;
  });
  return rowIndex;
};
const getElement = (module, elementId) => {
  let element = false;
  _.forEach(module.structure.rows, (row) => {
    if (row.id === elementId) {
      element = row;
      return false;
    }
    _.forEach(row.columns, (column) => {
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
  for (let i = 0; i < keys.length; i++) {
    if (!_.has(subData, [keys[i]]) || (Array.isArray(subData[keys[i]]) && isNaN(keys[i]))) {
      // prevent using named indexes on Array (sometimes the backend returns a array instead of a object.
      Vue.set(subData, [keys[i]], {});
    }
    if (i < keys.length - 1) {
      subData = subData[keys[i]];
    }
  }
  return subData;
};

const getters = {
  module(state) {
    return state.module;
  },
  moduleHeight(state) {
    return state.moduleHeight;
  },
  currentComponent(state) {
    if (state.currentElementId) {
      let columnIndex = getColumnIndexByElementId(state.module, state.currentElementId);
      let componentIndex = getComponentIndexByComponentId(state.module, state.currentElementId);
      columnIndex = columnIndex === false ? undefined : columnIndex;
      componentIndex = componentIndex === false ? undefined : componentIndex;
      return {
        columnIndex,
        componentIndex,
      };
    }
    return {};
  },
  currentElementId(state) {
    return state.currentElementId;
  },
  buildingMode(state) {
    return state.buildingMode;
  },
  showRaw(state) {
    return state.showRaw;
  },
  draggable(state) {
    return state.draggable;
  },
  slideToggles(state) {
    return state.slideToggles;
  },
};

const mutations = {
  setSecondaryLoader(state, data) {
    state.secondaryLoading = data;
  },
  setModuleData(state, data) {
    state.module = data;
  },
  setElementData(state, { elementId, value }) {
    let containerElement = {};
    let property = false;
    if(elementId) {
    let element = false;
    _.forEach(state.module.structure.rows, (row, rowIndex) => {
      if (row.id === elementId) {
        containerElement = state.module.structure.rows;
        property = rowIndex;
        return false;
      }
      _.forEach(row.columns, (column) => {
        if (column.id === elementId) {
          containerElement = row.columns;
          property = columnIndex;
          return false;
        }
        _.forEach(column.components, (CurrentComponent) => {
          if (CurrentComponent.id === elementId) {
            containerElement = column.components;
            property = componentIndex;
            return false;
          }
          return true;
        });
        return !element;
      });
      return !element;
    });
    } else {
      containerElement = state;
      property = 'module';
    }
    Vue.set(containerElement, property, value);
  },
  setModuleFields(state, data) {
    _.each(data, (value, field) => {
      state.module[field] = value;
    });
  },
  slideToggles(state, { key, value }) {
    Vue.set(state.slideToggles, key, value);
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
      state.currentElementId = false;
    }
  },
  setCurrentElementId(state, id) {
    state.currentElementId =id;
  },
  setModuleHeight(state, { key, value }) {
    Vue.set(state.moduleHeight, key, value);
  },
  setDraggable(state, { property, value }) {
    Vue.set(state.draggable, property, value);
  },
  clearCurrentComponent(state) {
    state.currentElementId = false;
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
  addColumn(state, {column, rowId}) {
    getElement(state.module, rowId).columns.push(column);
  },
  removeColumns(state, data) {
    state.module.structure.columns.splice(data.index, data.number);
  },
  setColumnWidth(state, data) {
    const column = state.module.structure.columns[data.colId];
    // Set attribute
    column.container.attribute.width = `${data.width}%`;
  },
  saveElementProperty(state, { elementId, property, value, ...scope }) {
    let element = elementId ? getElement(state.module, elementId) : state.module;
    element = scope.outStructure || elementId ?  element : element.structure;
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
  addComponent(state, {element, index, rowIndex, columnIndex}) {
    state.module.structure.rows[rowIndex].columns[columnIndex].components.splice(
      index,
      0,
      element,
    );
  },
  attachPlugins(state, data) {
    state.module.structure.columns[data.colId].components[
      data.componentId
    ].plugins = data.plugins;
  },
  removeElement(state, { elementId }) {
    const columnIndex = getColumnIndexByElementId(state.module, elementId);
    const rowIndex = getRowIndexByElementId(state.module, elementId);
    state.module.structure.rows[rowIndex].columns[
      columnIndex
    ].components.splice(
      getComponentIndexByComponentId(state.module, elementId),
      1,
    );
    // Set active the column that that contained the element.
    state.currentElementId = state.module.structure.rows[rowIndex].columns[columnIndex].id;
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

  setPluginElementConfig(state, { elementId, type, plugin, path, value }) {
    let element = elementId ? getElement(state.module, elementId) : state.module;
    const pluginData = element.plugins[plugin];
    const pathArray = _.concat([type || 'config'], path ? path.split('.') : []);
    const pluginOption = searchOrCreateLevel(pluginData, pathArray);
    Vue.set(pluginOption, pathArray[pathArray.length - 1], value);
  },
  setPluginComponentConfig(state, data) {
    // DEPRECATE
    const plugin =
      state.module.structure.columns[data.columnId].components[data.componentId]
        .plugins[data.plugin];
    const path = _.concat(['config'], data.path ? data.path.split('.') : []);
    const pluginOption = searchOrCreateLevel(plugin, path);
    Vue.set(pluginOption, path[path.length - 1], data.value);
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
    getElement(state.module, data.elementId).plugins[data.plugin].config.library.config.set_images.options =
      data.response;
    getElement(state.module, data.elementId).plugins[data.plugin].config[
      'sie-plugin-image-overlay_image'
    ].config.overlay_gallery.config.set_images.options = data.response;
  },
};

const actions = {
  addColumn(context, rowId) {
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

    context.commit('addColumn', {column :element.getProperties(), rowId});
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
    context.commit('saveElementProperty', payload);
    if (payload.sync !== false) {
      payload.property = 'textDirty';
      payload.value = Math.floor(100000 + (Math.random() * 900000));
      context.commit('saveElementProperty', payload);
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
