export default () => ({
  namespaced: true,

  state: {
    modelMessage: false,
    modelConnexion: false,
    modelSearch: false,
    modelCategories: false,
    modelBookmarks: false,
    modelStatus: false,
    modelValidation: false,
    modelComment: false,
    modelCall: false,
    modelCart: false,
    modelMessenger: false,
    bindFlash: {},
    bindInterstitial: {}
  },

  mutations: {
    openDialog(state, { name }) {
      state[name] = true;
    },
    closeDialog(state, { name }) {
      state[name] = false;
    },
    setFlash(state, option = {}) {
      state.bindFlash = option;
    },
    setInterstitial(state, option = {}) {
      state.bindInterstitial = option;
    }
  }
});
