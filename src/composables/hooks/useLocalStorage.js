import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import camelCase from "lodash/camelCase";

/**
 * Custom Hook for localStorage reactivity handling
 * @param {String} key The key of the local storage entry
 * @param {*} initial Initial/Default value
 * @param {String} label Label of the resulted state& modifiers name
 * @returns {Object}
 */
function useLocal(key, initial = null, label = null) {
  let stateName = label || camelCase(key);
  const storageState = useStorage(key, initial);
  const reactiveState =
    initial && typeof initial === "object"
      ? Object.keys(storageState.value).reduce((model, k) => {
          model[k] = computed({
            get: () => {
              return storageState.value[k];
            },
            set: v => {
              storageState.value[k] = v;
            }
          });

          return model;
        }, {})
      : computed({
          get: () => {
            return storageState.value;
          },
          set: v => {
            storageState.value = v;
          }
        });
  function remove() {
    storageState.value = initial;
  }
  return {
    [stateName]: reactiveState,
    [`clear${stateName}`]: remove
  };
}

export { useLocal };
