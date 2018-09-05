import Vue from 'vue';
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
  secondaryLoading: false,
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

  saveModuleProperty(state, data) {
    const structure = state.module.structure;
    const subComponent = data.subComponent ? structure[data.subComponent] : structure;
    const properties = data.link ? subComponent[data.link] : subComponent;
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
  sortColumn(state, data) {
    const components = state.module.structure.columns[data.colId].components;
    components.splice(data.newIndex, 0, components.splice(data.oldIndex, 1)[0]);
  },
  setColumnWidth(state, data) {
    const column = state.module.structure.columns[data.colId];
    // Set attribute
    column.container.attribute.width = `${data.width}%`;
  },
  saveColumnProperty(state, data) {
    const column = state.module.structure.columns[data.colId];
    const properties = data.subComponent ? column[data.subComponent][data.link] : column[data.link];
    Vue.set(properties, data.property, data.value);
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
    let pluginData = state.module;
    
    if (payload.componentId >= 0) {
      // save component plugin
      pluginData = pluginData.structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].config;
    } else if (payload.columnId >= 0) {
      // save column plugin
      pluginData = pluginData.structure.columns[payload.columnId].plugins[payload.plugin].config;
    } else {
      // save module plugin
      pluginData = pluginData.plugins[payload.plugin].config;
    }
    _.merge(pluginData, payload.config);
  },
  setPluginComponentConfig(state, data) {
    const plugin = state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin];
    const path = _.concat(['config'], data.path ? data.path.split('.') : []);
    const pluginOption = searchOrCreateLevel(plugin, path);
    Vue.set(pluginOption.data, pluginOption.property, data.value);
  },
  savePluginSuboption(state, payload) {
    let pluginOptions = state.module;
    if (payload.componentId >= 0) {
      // save component plugin
      pluginOptions = pluginOptions.structure.columns[payload.columnId].components[payload.componentId].plugins[payload.plugin].config.options;
    } else if (payload.columnId >= 0) {
      // save column plugin
      pluginOptions = pluginOptions.structure.columns[payload.columnId].plugins[payload.plugin].config.options;
    } else {
      // save module plugin
      pluginOptions = pluginOptions.plugins[payload.plugin].config.options;
    }
    _.assign(pluginOptions[payload.subOption], payload.config.options[payload.subOption]);
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
  saveComponentProperty(state, data) {
    const component = state.module.structure.columns[data.columnId].components[data.componentId];
    const subComponent = data.subComponent ? component[data.subComponent] : component;
    const properties = data.link ? subComponent[data.link] : subComponent;
    Vue.set(properties, data.property, data.value);
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
    state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].config.library.config.set_images.options = data.response;
    state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].config['sie-plugin-image-overlay_image'].config.overlay_gallery.config.set_images.options = data.response;
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
