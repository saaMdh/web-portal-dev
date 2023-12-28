export default () => ({
  namespaced: true,

  state: {
    drawer: false,
    globalLoader: false,
    onLine: null
  },

  mutations: {
    toggleDrawer(state, enabled = null) {
      if (enabled === null) state.drawer = !state.drawer;
      else state.drawer = enabled;
    },
    toggleGlobalLoader(state, bool = true) {
      state.globalLoader = bool;
    },
    toggleOnLine(state, bool = true) {
      state.onLine = bool;
    }
  }
});
