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
  error(state, err) {
    console.log(err);
  },
};

const actions = {
  getModuleData(context, data) {
    if (data.moduleId) {
      return moduleService.getModule()
        .then(response => context.commit('setModuleData', response))
        .catch(error => context.commit('error', error));
    }
    return moduleService.newModule()
      .then(response => context.commit('setModuleData', response))
      .catch(error => context.commit('error', error));
  },

  saveModuleData(context, data) {
    if (data.moduleId) {
      return moduleService.saveModule(data)
        .then(response => context.commit('setModuleData', response))
        .catch(error => context.commit('error', error));
    }
    return moduleService.createModule(data)
      .then(response => context.commit('setModuleData', response))
      .catch(error => context.commit('error', error));
  },

  setCurrentComponent(context, data) {
    context.commit('setCurrentComponent', data);
  },
};

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};