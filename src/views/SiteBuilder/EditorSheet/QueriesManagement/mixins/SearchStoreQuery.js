import { SearchStoreQuery } from "@/views/SiteBuilder/EditorSheet/QueriesManagement/Search.graphql";
import StoreSearchState, {
  QUERY_DEFAULT
} from "@/views/SiteBuilder/EditorSheet/QueriesManagement/StoreSearchState";

import isEqual from "lodash/isEqual";
import assign from "lodash/assign";
import get from "lodash/get";

function toBoolean(b) {
  if (typeof b === "boolean") return b;
  return ["1", "true"].includes(b);
}

export default {
  props: {
    modelValue: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      loading: 0,
      error: null,
      notFound: null,
      search: {
        data: []
      },
      pagination: {
        page: 1
      },
      name: "",
      count: 8,
      keywords: "",
      queryFilter: StoreSearchState,
      activeSearchFilter: { value: false }
    };
  },
  created() {
    if (this.modelValue && this.modelValue.filter) {
      this.initFromQuery({
        filter: this.modelValue.filter,
        q: this.modelValue.q
      });
    }
  },
  computed: {
    query: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    },
    notAvailable() {
      return this.notFound === true;
    },
    categorySlug() {
      return this.queryFilter.categorySlug === 0
        ? null
        : this.queryFilter.categorySlug;
    }
  },

  watch: {
    queryFilter: {
      deep: true,
      immediate: true,
      handler() {
        this.error = null;
        this.query = {
          name: this.getQueryName(),
          q: this.keywords,
          count: parseInt(this.query.count),
          filter: this.getFiltersForQuery()
        };
      }
    },
    keywords: {
      deep: true,
      immediate: true,
      handler() {
        this.error = null;
        this.query = {
          name: this.getQueryName(),
          q: this.keywords,
          count: parseInt(this.query.count),
          filter: this.getFiltersForQuery()
        };
      }
    }
  },

  apollo: {
    search: {
      query() {
        return SearchStoreQuery;
      },
      loadingKey: "loading",
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      update: data => data.search,
      variables() {
        if (!isEqual(this.queryFilter, QUERY_DEFAULT))
          return {
            q: "",
            filter: {
              count: 3,
              categorySlug: this.categorySlug
            }
          };
      },
      skip() {
        return !this.categorySlug;
      },
      result({ data }) {
        this.search = { data: data.searchStore.data };
      },
      error({ graphQLErrors, networkError }) {
        this.error = graphQLErrors.length > 0 || !!networkError;
      }
    }
  },

  methods: {
    resetFilter() {
      assign(this.queryFilter, QUERY_DEFAULT);
    },
    resetCategories() {
      this.queryFilter.categorySlug = null;
    },

    applyFilter(filterValues, categorySlug = null) {
      const newFilter = {
        categorySlug: filterValues.categorySlug || categorySlug,
        hasDelivery: filterValues.hasDelivery || false,
        regionId: filterValues.regionId || null,
        cityId: filterValues.cityId || null,
        page: 1
      };
      assign(this.queryFilter, newFilter);
    },

    applyPagination(page) {
      this.queryFilter.fetchActiveCategory = false;

      this.queryFilter.page = page;
    },

    applyCategory(category) {
      const cityId = this.queryFilter.cityId;
      const regionId = this.queryFilter.regionId;
      const hasDelivery = this.queryFilter.hasDelivery;
      this.resetFilter();
      if (category) {
        this.queryFilter.categorySlug = category.slug;
        this.queryFilter.category = category;
      } else this.queryFilter.categorySlug = null;

      this.queryFilter.cityId = cityId;
      this.queryFilter.regionId = regionId;
      this.queryFilter.origin = origin;
      this.queryFilter.hasDelivery = hasDelivery;
    },
    applyKeywords(keywords) {
      this.keywords = keywords;
      this.queryFilter.page = 1;
    },

    applyCategoryWithDelivery(category) {
      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      this.queryFilter.categorySlug = category.slug;

      this.queryFilter.hasDelivery = true;
    },

    applyDelivery(delivery) {
      this.queryFilter.hasDelivery = delivery;
    },

    getFiltersForQuery() {
      return {
        categorySlug: this.categorySlug,
        hasDelivery: toBoolean(this.queryFilter.hasDelivery),
        regionId: this.queryFilter.regionId,
        cityId: this.queryFilter.cityId
      };
    },
    initFromQuery({ filter }) {
      this.queryFilter.categorySlug = filter.categorySlug;
      this.queryFilter.regionId = filter.regionId;
      this.queryFilter.cityId = filter.cityId;
      this.queryFilter.hasDelivery = "" + filter.hasDelivery;
    },
    getQueryName() {
      const CategoryName = get(this.queryFilter, "category.name");
      return Object.values(this.query.name).join("")
        ? this.query.name
        : {
            fr: CategoryName,
            ar: CategoryName,
            en: CategoryName
          };
    }
  },
  beforeUnmount() {
    this.resetFilter();
    this.resetCategories();
  }
};
