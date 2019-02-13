import Vue from 'vue';

function settingStore() {
  return {
    namespaced: true,
    state: {
      settings: undefined,
      customFontsList: [],
      currentFont: undefined,
      modalEditFont: false,
    },
    getters: {
      settings(state) {
        return state.settings;
      },
      customFontsList(state) {
        return state.customFontsList;
      },
      modalEditFont(state) {
        return state.modalEditFont;
      },      
      currentFont(state) {
        return state.currentFont;
      },
    },
    mutations: {
      setSettings(state, data) {
        Vue.set(state, 'settings', data);
      },
      setCustomFontsList(state, data) {
        Vue.set(state, 'customFontsList', data);
      },
      toggleModal(state, modalName) {
        Vue.set(state, modalName, !state[modalName]);
      },
      setCurrentFont(state, data) {
        Vue.set(state, 'currentFont', data);
      },
      error(err) {
        console.error(err);
      },
    },
  };
}

module.exports = settingStore();
