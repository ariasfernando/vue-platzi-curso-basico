import moduleService from '../services/module'

const state = {
  module: {},
  currentComponent: {}
};

const getters = {
  module (state) {
    return state.module
  },
  currentComponent (state) {
    return state.currentComponent
  }
};

const mutations = {
  loadModuleData(state, data) {
    state.module = data;
  },
  setCurrentComponent(state, data) {
    state.currentComponent = data;
  },
  error(state, err) {
    console.log(err);
  }
};

const actions = {
  getModuleData (context, data) {

    if ( data.moduleId ) {
      return moduleService.getModule()
        .then((response) => context.commit('loadModuleData', response))
        .catch((error) => context.commit('error', error));
    } else {
      return moduleService.newModule()
        .then((response) => context.commit('loadModuleData', response))
        .catch((error) => context.commit('error', error));
    }

  },

  setCurrentComponent (context, data) {
    context.commit('loadModuleData', data);
  }
};

module.exports = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};