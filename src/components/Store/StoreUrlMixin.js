// import trimEnd from "lodash/trimEnd";

export default {
  methods: {
    getStoreUrl(store) {
      return {
        name: "store",
        params: { storeId: store.id, storeSlug: store.slug }
      };
    }
  }
};
