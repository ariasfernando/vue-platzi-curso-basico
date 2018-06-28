/* eslint no-param-reassign:0 */
/* eslint no-shadow:0 */
/* eslint no-console:0 */

import libraryService from '../services/library';

const state = {
  modules: [],
};

const getters = {
  modules() {
    return state.modules;
  },
};

const mutations = {
  loadModulesData(state, modulesData) {
    state.modules = modulesData;
  },
  error(state, err) {
    console.error('has occurred a error:', err.body.message);
  },
};

const actions = {
  getModulesData(context, libraryId) {
    return libraryService.getMenuItems(libraryId)
      .then((response) => {
        context.commit('loadModulesData', response.modules);
      })
      .catch((err) => {
        context.commit('error', err); 
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
