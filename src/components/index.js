import Lazy from "./lazy.vue";
import okListComponents from "./uiKit/list";
export default function LoadComponent(app) {
  app.component("Lazy", Lazy);
  Object.keys(okListComponents).forEach(name => {
    app.component(name, okListComponents[name]);
  });
}
