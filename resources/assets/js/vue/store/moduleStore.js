import _ from 'underscore-contrib';
import moduleService from '../services/module';

const state = {
  module: {},
  currentComponent: {},
  loading: false,
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
  updateComponent(state, data) {
    state.module.structure.columns[data.columnId].components[data.componentId] = data.component;
  },
  saveModule(state, moduleId) {
    state.module.id = moduleId;
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