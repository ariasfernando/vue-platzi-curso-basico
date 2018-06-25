import libraryService from '../services/library';

const state = {
  modules: [],
};

const setModuleFixedStatus = (fixedModules = [], item) => {
  const found = fixedModules.find(fixed => fixed.key === item.key);
  return {
    ...JSON.parse(JSON.stringify(item)),
    isFixed: found ? true : false,
    fixedPosition: found ? found.pos : undefined,
    type: found ? found.mandatory ? 'virtual' : item.type : item.type,
    mandatory: found ? found.mandatory ? true : false : false
  };
}

const getters = {
  modules(state, getters, rootState) {
    const fixedModules = rootState.campaign ? rootState.campaign.campaign ? rootState.campaign.campaign.library_config ? rootState.campaign.campaign.library_config.fixedModules ? JSON.parse(rootState.campaign.campaign.library_config.fixedModules) : [] : [] : [] : [];
    return state.modules.map(moduleData => {
      return setModuleFixedStatus(fixedModules, moduleData);
    });
  }
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