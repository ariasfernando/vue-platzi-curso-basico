/* eslint no-console: 0 */

import configService from '../services/config';

function configStore() {
  return {
    namespaced: true,
    state: {
      config: {},
    },
    getters: {
      config(state) {
        return state.config;
      },
    },
    mutations: {
      loadConfigData(state, data) {
        state.config[data[0]] = data[1];
      },
      error(state, err) {
        console.error(err);
      },
    },
    actions: {

      getConfig(context, configFile) {
        return configService.getConfig(configFile)
          .then((response) => {
            context.commit('loadConfigData', [configFile, response]);
          })
          .catch(error => context.commit('error', error));
      },
    },
  };
}

module.exports = configStore();
