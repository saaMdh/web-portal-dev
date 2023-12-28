import { watch } from "vue";
import { useRoute } from "vue-router";

let cb = null;
let globalCallBack = () => {};

export function injectGlobalCbRouteWatcher(callback) {
  globalCallBack = callback;
}

export function injectCbRouteWatcher(callback = null) {
  cb = callback;
}

export function clearCbRouteWatcher() {
  cb = null;
}

export function loadRouteWatcher() {
  const route = useRoute();
  watch(
    () => ({ ...route }),
    (newValue, oldValue) => {
      globalCallBack(route, newValue, oldValue);
      setTimeout(() => {
        if (cb) cb(route, newValue, oldValue);
      }, 200);
    },
    {
      immediate: true
    }
  );
}
