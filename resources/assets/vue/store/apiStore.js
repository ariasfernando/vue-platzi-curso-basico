function apiStore() {
  return {
    namespaced: true,
    state: {
      oauthToken: undefined,
    },
    mutations: {
      setOauthToken(state, token) {
        state.oauthToken = token;
      },
      error(err) {
        console.error(err);
      },
    },
  };
}

module.exports = apiStore();
