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
      error(state, err) {
        console.error(err);
      },
    },
  };
}

module.exports = apiStore();
