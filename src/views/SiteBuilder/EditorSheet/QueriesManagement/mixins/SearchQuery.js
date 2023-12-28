import {
  SearchQuery,
  SearchQueryWithoutFilters
} from "@/views/SiteBuilder/EditorSheet/QueriesManagement/Search.graphql";
import SearchState, {
  QUERY_DEFAULT
} from "@/views/SiteBuilder/EditorSheet/QueriesManagement/SearchState";

import mapValues from "lodash/mapValues";
import toString from "lodash/toString";
import groupBy from "lodash/groupBy";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";
import assign from "lodash/assign";
import cloneDeep from "lodash/cloneDeep";
import map from "lodash/map";
import get from "lodash/get";

function toPairValues(fields, specs) {
  return map(fields, (value, key) => {
    if (
      value === "false" ||
      value === undefined ||
      value === "" ||
      (isArray(value) && value.length === 0) ||
      value === null
    )
      return undefined;

    if (key in specs) {
      if (specs[key] === "MULTI") value = value.split(",");
    }

    return { key, value };
  }).filter(v => v !== undefined);
}

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
        active: null,
        suggested: [],
        announcements: {
          data: {}
        }
      },

      pagination: {
        page: 1
      },
      name: "",
      count: 8,
      queryFilter: SearchState,
      activeSearchFilter: { value: false }
    };
  },
  created() {
    if (this.query && this.query.filter) {
      this.initFromQuery({
        filter: this.query.filter,
        q: this.query.q
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
    },
    searchKeywords: {
      get() {
        return this.queryFilter.keywords;
      },
      set(v) {
        this.queryFilter.keywords = v;
      }
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
          q: this.searchKeywords,
          count: parseInt(this.query.count),
          filter: this.getFiltersForQuery()
        };
      }
    }
  },

  apollo: {
    search: {
      query() {
        return this.queryFilter.fetchActiveCategory
          ? SearchQuery
          : SearchQueryWithoutFilters;
      },
      loadingKey: "loading",
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      variables() {
        if (!isEqual(this.queryFilter, QUERY_DEFAULT))
          return {
            filter: {
              categorySlug: this.categorySlug
            }
          };
      },
      skip() {
        return !this.categorySlug;
      },
      result({ data, loading }) {
        if (loading) return;

        this.$stats.recordSearch(location.href);

        this.notFound = false;

        if (data && get(data, "search") && !get(data, "search.active")) {
          this.notFound = true;
          return;
        }

        if (
          data &&
          data.search &&
          data.search.active &&
          this.queryFilter.fetchActiveCategory
        ) {
          this.queryFilter.category = cloneDeep(data.search.active.category);
        }
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
      filterValues.page = 1;

      assign(this.queryFilter, filterValues);

      this.queryFilter.categorySlug = categorySlug;
    },

    applyKeywords(keywords, categorySlug = null) {
      this.queryFilter.keywords = keywords;
      this.queryFilter.categorySlug = categorySlug;
      this.queryFilter.page = 1;
    },

    applyGkeywords(keywords, categorySlug = null) {
      this.resetFilter();

      this.queryFilter.keywords = keywords;
      this.queryFilter.categorySlug = categorySlug;
      this.queryFilter.page = 1;
    },

    applyPagination(page) {
      this.queryFilter.fetchActiveCategory = false;

      this.queryFilter.page = page;
    },

    applyCategory(category) {
      const cityIds = this.queryFilter.cityIds;
      const model = this.queryFilter.model;
      const regionIds = this.queryFilter.regionIds;
      const keywords = this.queryFilter.keywords;
      const hasPictures = this.queryFilter.hasPictures;
      const hasPrice = this.queryFilter.hasPrice;
      const priceRange = this.queryFilter.priceRange;
      const origin = this.queryFilter.origin;
      const delivery = this.queryFilter.delivery;
      const exchange = this.queryFilter.exchange;

      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      if (category) {
        this.queryFilter.categorySlug = category.slug;
        this.queryFilter.category = category;
      } else this.queryFilter.categorySlug = null;

      this.queryFilter.cityIds = cityIds;
      this.queryFilter.model = model;
      this.queryFilter.regionIds = regionIds;
      this.queryFilter.keywords = keywords;
      this.queryFilter.hasPictures = hasPictures;
      this.queryFilter.hasPrice = hasPrice;
      this.queryFilter.priceRange = priceRange;
      this.queryFilter.origin = origin;
      this.queryFilter.delivery = delivery;
      this.queryFilter.exchange = exchange;
    },

    applyCategoryWithDelivery(category) {
      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      this.queryFilter.categorySlug = category.slug;

      this.queryFilter.delivery = "DELIVERY_AVAILABLE";
    },

    applyAlternative(keywords, categorySlug) {
      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      this.queryFilter.categorySlug = categorySlug;
      this.queryFilter.keywords = keywords;

      this.$nextTick(() => this.updateRoute(true));
    },

    applyDelivery(delivery) {
      this.queryFilter.delivery = delivery;
    },

    getFiltersForQuery() {
      let specs = {};
      if (this.search.active) {
        specs = map(
          this.search.active.category.specifications,
          "specification"
        );
        specs = groupBy(specs, "codename");
        specs = mapValues(specs, s => s[0].type);
      }

      const regionIds = this.queryFilter.regionIds.map(region =>
        region.split("-").pop()
      );

      const cityIds = this.queryFilter.cityIds.map(city =>
        city.split("-").pop()
      );

      return {
        categorySlug: this.categorySlug,
        origin: this.queryFilter.origin,
        connected: this.queryFilter.connected,
        delivery: this.queryFilter.delivery,
        regionIds: regionIds,
        cityIds: cityIds,
        priceRange: this.queryFilter.priceRange,
        exchange: toBoolean(this.queryFilter.exchange),
        hasPictures: toBoolean(this.queryFilter.hasPictures),
        hasPrice: toBoolean(this.queryFilter.hasPrice),
        priceUnit: this.queryFilter.priceUnit,
        fields: toPairValues(this.queryFilter.model, specs)
      };
    },
    initFromQuery({ filter, q }) {
      this.searchKeywords = q;
      this.queryFilter.categorySlug = filter.categorySlug;
      this.queryFilter.origin = filter.origin;
      this.queryFilter.connected = filter.connected;
      this.queryFilter.delivery = filter.delivery;
      this.queryFilter.regionIds = filter.regionIds;
      this.queryFilter.cityIds = filter.cityIds;
      this.queryFilter.priceRange = filter.priceRange;
      this.queryFilter.exchange = "" + filter.exchange;
      this.queryFilter.hasPictures = "" + filter.hasPictures;
      this.queryFilter.hasPrice = "" + filter.hasPrice;
      this.queryFilter.priceUnit = get(toString(filter.priceUnit), null);
      this.queryFilter.model = filter.fields.reduce((accu, curr) => {
        let { key, value } = curr;
        if (isArray(value)) value = value.join(",");
        accu[key] = value;
        return accu;
      }, {});
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
