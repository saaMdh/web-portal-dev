import { createStore } from "vuex";
import getters from "./getters";
import Session from "./modules/session";
import UI from "./modules/ui";
import App from "./modules/app";
import Dialog from "./modules/dialog";
import pathify from "vuex-pathify";

export function _createStore({ $apollo }) {
  return createStore({
    modules: {
      session: Session($apollo),
      ui: UI($apollo),
      app: App($apollo),
      dialog: Dialog()
    },
    plugins: [pathify.plugin],
    getters
  });
}
