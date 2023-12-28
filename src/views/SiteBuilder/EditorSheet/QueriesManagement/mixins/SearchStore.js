import { SearchStoreQuery } from "@/views/SiteBuilder/EditorSheet/QueriesManagement/Search.graphql";

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
      this.searchStore.data.filter(() => false === true);
    }
  },

  apollo: {
    searchStore: {
      loadingKey: "loading",
      fetchPolicy: "cache-and-network",
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
