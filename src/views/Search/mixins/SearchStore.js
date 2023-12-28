import { SearchStoreQuery } from "../Search.graphql";

export default {
  data() {
    return {
      searchStore: {
        data: []
      }
    };
  },

  watch: {
    "queryFilter.keywords"() {
      this.searchStore.data = [];
    }
  },

  apollo: {
    searchStore: {
      loadingKey: "loading",
      fetchPolicy: "no-cache",
      query: SearchStoreQuery,
      skip() {
        return !this.queryFilter.keywords;
      },
      variables() {
        return {
          q: this.queryFilter.keywords,
          filter: {
            count: 3
          }
        };
      }
    }
  }
};
