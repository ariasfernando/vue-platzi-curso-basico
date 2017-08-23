import _ from 'lodash';
import moduleService from '../services/module';
import defaultElements from '../resources/elements';

const state = {
  module: {},
  currentComponent: {},
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
  updateElement(state, data) {
    _.each(data.data, (value, field) => {
      state.module.structure.columns[data.columnId].components[data.componentId][field] = value;
    });
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
  saveModule(state, moduleId) {
    state.module.id = moduleId;
  },
  addColumn(state, column) {
    state.module.structure.columns.push(_.cloneDeep(defaultElements.column));
  },
  removeColumns(state, data) {
    state.module.structure.columns.splice(data.index, data.number);
  },
  setColumnWidth(state, data) {
    const column = state.module.structure.columns[data.colId];
    // Set attribute
    column.attribute.width = `${data.width}%`;
    // Find and set setting
    const key = _.findKey(column.settings, { name: 'width' });
    column.settings[key].value = `${data.width}%`;
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
  savePlugin(state, data) {
    const pluginData = state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].data;
    _.merge(pluginData, data.data);
  },
  togglePlugin(state, data) {
    state.module.structure.columns[data.columnId].components[data.componentId].plugins[data.plugin].enabled = data.enabled;
  },
  saveComponentAttribute(state, data) {
    const attributes = state.module.structure.columns[data.columnId].components[data.componentId].attribute;
    attributes[data.attribute] = data.attributeValue;
  },
  error(state, err) {
    console.log(err);
  },
};

const actions = {
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
};

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
