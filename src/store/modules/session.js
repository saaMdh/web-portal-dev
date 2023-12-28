export default () => ({
  namespaced: true,

  state: {
    user: null,
    token: null
  },

  mutations: {
    setToken(state, { token }) {
      state.token = token;
    },

    setUser(state, { user }) {
      state.user = user;
    },

    setScope(state, scope) {
      state.scope = scope;
    },

    setScopeList(state, scopeList) {
      state.scopeList = scopeList;
    }
  }
});
