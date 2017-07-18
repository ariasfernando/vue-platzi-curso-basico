import _ from 'lodash';
import moduleService from '../services/module';
import defaultElements from '../resources/elements';

const state = {
  module: {},
  currentComponent: {},
  loading: false
};

const getters = {
  module(state) {
    return state.module;
  },
  currentComponent(state) {
    return state.currentComponent;
  },
};

const mutations = {
  setLoader(state, data) {
    state.loading = data;
  },
  setModuleData(state, data) {
    state.module = data;
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
  saveModule(state, moduleId) {
    state.module.id = moduleId;
  },
  addColumn(state) {
    state.module.structure.columns.push(_.cloneDeep(defaultElements.column));
  },
  removeColumns(state, data) {
    state.module.structure.columns.splice(data.index, data.number);
  },
  addComponent(state, data) {
    let el = _.cloneDeep(defaultElements[data.type]);
    state.module.structure.columns[data.colId].components.splice(data.index, 0, el);
  },
  removeComponents(state, data) {
    state.module.structure.columns[data.colId].components.splice(data.index, data.number);
  },
  error(state, err) {
    console.log(err);
  },
};

const actions = {
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