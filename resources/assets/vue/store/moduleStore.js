import Vue from 'vue/dist/vue';
import Q from 'q';
import _ from 'lodash';
import clone from 'clone';
import Element from '../models/Element';
import moduleService from '../services/module';
import imageService from '../services/image';

const state = {
  module: {},
  currentComponent: {},
  activeColumn: 0,
  buildingMode: 'desktop',
  showRaw: false,
  changeSettingComponent: {
    style: {},
    attribute: {},
  },
  loading: false,
};

const getters = {
  module(state) {
    return state.module;
  },
  currentComponent(state) {
    return state.currentComponent;
  },
  changeSettingComponent(state) {
    return state.changeSettingComponent;
  },
  activeColumn(state) {
    return state.activeColumn;
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
  setModuleData(state, data) {
    state.module = data;
  },
  setModuleFields(state, data) {
    _.each(data, (value, field) => {
      state.module[field] = value;
    });
  },
  setChangeSettingComponent(state, data) {
    state.changeSettingComponent.style = data.style;
    state.changeSettingComponent.attribute = data.attribute;
  },
  setCurrentComponent(state, data) {
    state.currentComponent = data;
  },
  clearCurrentComponent(state) {
    state.currentComponent = {};
  },
  updateElement(state, payload) {
    const update = { ...state.module.structure.columns[payload.columnId].components[payload.componentId].data, ...payload.data };
    state.module.structure.columns[payload.columnId].components[payload.componentId].data = update;
  },
  saveComponent(state, data) {
    state.module.structure.columns[data.columnId].components[data.componentId] = data.component;
  },
  saveModuleSetting(state, data) {
    state.module.structure.style = data.style;
  },
  saveModuleStyle(state, data) {
    state.module.structure.style[data.property] = data.value;
  },
  saveModuleAttribute(state, data) {
    state.module.structure.attribute[data.property] = data.value;
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
  sortColumn(state, data) {
    const components = state.module.structure.columns[data.colId].components;
    components.splice(data.newIndex, 0, components.splice(data.oldIndex, 1)[0]);
  },
  setColumnWidth(state, data) {
    const column = state.module.structure.columns[data.colId];
    // Set attribute
    column.attribute.width = `${data.width}%`;
  },
  saveColumnStyle(state, data) {
    const styles = state.module.structure.columns[data.colId].style;
    const newStyles = {};
    newStyles[data.property] = data.value;
    _.merge(styles, newStyles);
  },
  saveColumnAttribute(state, data) {
    const attribute = state.module.structure.columns[data.colId].attribute;
    const newAttribute = {};
    newAttribute[data.property] = data.value;
    _.merge(attribute, newAttribute);
  },
  addComponent(state, data) {
    state.module.structure.columns[data.colId].components.splice(data.index, 0, data.el);
  },
  attachPlugins(state, data) {
    state.module.structure.columns[data.colId].components[data.componentId].plugins = data.plugins;
  },
  removeComponents(state, data) {
    state.module.structure.columns[data.colId].components.splice(data.index, data.number);
  },
  savePlugin(state, payload) {
    const pluginData = state.module.structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].config;
    _.merge(pluginData, payload.config);
  },
  togglePlugin(state, data) {
    if (data.columnId >= 0 || data.componentId >= 0) {
      if (data.componentId >= 0) {
        state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].enabled = data.enabled;
      } else {
        state.module.structure.columns[data.columnId].plugins[data.plugin].enabled = data.enabled;
      }
    } else {
      state.module.plugins[data.plugin].enabled = data.enabled;
    }
  },
  saveComponentStyle(state, data) {
    const style = state.module.structure.columns[data.columnId].components[data.componentId].style;
    const newStyle = {};
    newStyle[data.property] = data.value;
    _.merge(style, newStyle);
  },
  saveComponentStyleOption(state, data) {
    const styleOptions = state.module.structure.columns[data.columnId].components[data.componentId].styleOptions;
    const newStyleOptions = {};
    newStyleOptions[data.property] = data.value;
    _.merge(styleOptions, newStyleOptions);
  },
  saveComponentAttribute(state, data) {
    const attribute = state.module.structure.columns[data.columnId].components[data.componentId].attribute;
    const newAttr = {};
    newAttr[data.property] = data.value;
    _.merge(attribute, newAttr);
  },
  setActiveColumn(state, columnId) {
    state.activeColumn = columnId;
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
    console.log(err);
  },
  setListLibraries(state, data) {
    state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].config.library.options = data.response;
  }
};

const actions = {
  addColumn(context) {
    // Get column plugins
    const plugins = {};
    const modulePlugins = Vue.prototype.$_app.modulePlugins;

    _.each(modulePlugins, (plugin, name) => {
      if (plugin.target.indexOf('column') !== -1) {
        plugins[name] = clone(plugin);
      }
    });

    // Create new instance of Element width default column data
    const element = new Element({ type: 'column-element', plugins });

    context.commit('addColumn', element.getProperties());
  },
  sortColumn(context, data) {
    context.commit('sortColumn', data);
    return context.state.module;
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
    return moduleService.saveModule(data)
      .then((response) => {
        if (response.message && response.message === 'SUCCESS') {
          context.commit('saveModule', response.id);
          return response.id;
        }
      })
      .catch(error => context.commit('error', error));
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
  getLibraries(context, data) {
    imageService.getLibraries().then(response => {
      response.data.push('');
      
      context.commit('setListLibraries', {
        ...data,
        response: response.data
      });
    });
  }
};

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
