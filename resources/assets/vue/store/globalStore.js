const state = {
  loading: false,
};

const getters = {};

const mutations = {
  setLoader(state, data) {
    state.loading = data;
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