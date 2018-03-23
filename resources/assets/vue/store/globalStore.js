const state = {
  loading: false,
  secondaryLoading: false,
};

const getters = {};

const mutations = {
  setLoader(state, data) {
    state.loading = data;
  },
  setSecondaryLoader(state, data) {
    state.secondaryLoading = data;
  },
};

const actions = {};

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};