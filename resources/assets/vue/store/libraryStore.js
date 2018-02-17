import libraryService from '../services/library';

const state = {
  modules: [],
};

const getters = {
  modules(state) {
    return state.modules;
  },
};

const mutations = {
  loadModulesData(state, modulesData) {
    state.modules = modulesData;
  },
};

const actions = {
  getModulesData(context, libraryId) {

    return libraryService.getMenuItems(libraryId)
      .then((response) => {
        context.commit('loadModulesData', response.modules);
      })
      .catch(error => context.commit('error', error));
  },
};

module.exports = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
};