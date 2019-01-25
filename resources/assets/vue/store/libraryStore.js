/* eslint no-param-reassign:0 */
/* eslint no-shadow:0 */
/* eslint no-console:0 */

import {
  map,
} from 'lodash';
import libraryService from '../services/library';

const state = {
  modules: [],
};

const setModuleFixedStatus = (fixedModules = [], item) => {
  const found = fixedModules.find(fixed => fixed.key === item.key);
  return {
    ...JSON.parse(JSON.stringify(item)),
    isFixed: !!found,
    fixedPosition: found ? found.pos : undefined,
    type: found ? found.mandatory ? 'virtual' : item.type : item.type,
    mandatory: found ? !!found.mandatory : false,
  };
};

const getters = {
  modules(state, getters, rootState) {
    const fixedModules = rootState.campaign ? rootState.campaign.campaign ? rootState.campaign.campaign.library_config ? rootState.campaign.campaign.library_config.fixedModules ? JSON.parse(rootState.campaign.campaign.library_config.fixedModules) : [] : [] : [] : [];
    return map(_.cloneDeep(state.modules), (moduleData) => {
      if (moduleData.sub_menu) {
        moduleData.sub_menu = map(moduleData.sub_menu, subModuleData => setModuleFixedStatus(fixedModules, subModuleData));
        return moduleData;
      }
      return setModuleFixedStatus(fixedModules, moduleData);
    });
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
  /* develblock:start */
  setModuleFixedStatus,
  /* develblock:end */
};
