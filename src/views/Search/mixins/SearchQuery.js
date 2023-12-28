import assign from "lodash/assign";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import isArray from "lodash/isArray";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import toInteger from "lodash/toInteger";
import { SearchQuery, SearchQueryWithoutFilters } from "../Search.graphql";
import SearchState, { QUERY_DEFAULT } from "../SearchState";
import SearchHistoryMixin from "@/views/Search/mixins/SearchHistory";

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

const PAGINATION_COUNT = 4 * 12;

export default {
  mixins: [SearchHistoryMixin],
  data() {
    return {
      loading: 0,

      skipSearch: true,

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

      queryFilter: SearchState,

      activeSearchFilter: { value: false }
    };
  },

  watch: {
    queryFilter: {
      deep: true,
      handler() {
        this.error = null;
      }
    },

    "queryFilter.keywords"() {
      this.gotToHeader();
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
      fetchPolicy: "network-only",
      skip() {
        return this.skipSearch;
      },
      variables() {
        return {
          q: this.queryFilter.keywords,
          filter: {
            ...this.filtersForQuery,
            page: toInteger(this.queryFilter.page),
            count: PAGINATION_COUNT
          }
        };
      },
      result({ data, loading }) {
        if (loading) return;
        this.notFound = false;

        //Remove search query from history if no results found
        if (get(data, "search.announcements.data.length", 0) === 0) {
          this.recentSearches = this.recentSearches.filter(
            term => term.text !== this.queryFilter.keywords
          );
        }
        if (data && get(data, "search") && !get(data, "search.active")) {
          this.notFound = true;
          this.gotToTop();
          return;
        }

        if (
          data &&
          data.search &&
          data.search.active &&
          this.queryFilter.fetchActiveCategory
        ) {
          this.queryFilter.category = data.search.active.category;
        }
      },
      error({ graphQLErrors, networkError }) {
        this.error = graphQLErrors.length > 0 || !!networkError;
      }
    }
  },

  methods: {
    gotToHeader() {
      setTimeout(() => {
        const el = document.querySelector("#search-header");
        if (el) window.scrollTo({ top: el.offsetTop - 5 });
      }, 500);
    },

    gotToTop() {
      window.scrollTo(0, 0);
    },

    resetFilter() {
      assign(this.queryFilter, QUERY_DEFAULT);
    },

    applyFilter(filterValues, categorySlug = null) {
      filterValues.page = 1;

      assign(this.queryFilter, filterValues);

      this.queryFilter.categorySlug = categorySlug;

      this.gotToHeader();

      this.$nextTick(() => this.updateRoute());
    },

    applyFilterAndKeywords(filterValues, keywords, categorySlug = null) {
      filterValues.page = 1;
      assign(this.queryFilter, filterValues);

      this.queryFilter.categorySlug = categorySlug;

      this.queryFilter.keywords = keywords === "" ? null : keywords;

      this.gotToHeader();

      this.$nextTick(() => this.updateRoute());
    },
    applyEtat(e) {
      this.queryFilter.fetchActiveCategory = false;
      this.queryFilter.model = { etat: e };
      this.queryFilter.page = 1;
      this.$nextTick(() => this.updateRoute());
    },

    applyKeywords(keywords, categorySlug = null) {
      this.queryFilter.keywords = keywords === "" ? null : keywords;
      this.queryFilter.categorySlug = categorySlug;
      this.queryFilter.page = 1;

      this.gotToHeader();

      this.$nextTick(() => this.updateRoute());
    },

    applyGkeywords(keywords, categorySlug = null) {
      this.resetFilter();

      this.queryFilter.keywords = keywords === "" ? null : keywords;
      this.queryFilter.categorySlug = categorySlug;
      this.queryFilter.page = 1;

      this.gotToHeader();

      this.$nextTick(() => this.updateRoute());
    },

    applyPagination(page) {
      this.queryFilter.fetchActiveCategory = false;

      this.queryFilter.page = page;

      this.gotToHeader();

      this.$nextTick(() => this.updateRoute());
    },

    applyCategory(category) {
      // <!-- To keep between categories -->
      const cityIds = this.queryFilter.cityIds;
      const regionIds = this.queryFilter.regionIds;
      const keywords = this.queryFilter.keywords;
      const hasPictures = this.queryFilter.hasPictures;
      const hasPrice = this.queryFilter.hasPrice;
      const priceRange = this.queryFilter.priceRange;
      const origin = this.queryFilter.origin;
      const exchange = this.queryFilter.exchange;

      let delivery = null;
      if (category.delivery) delivery = this.queryFilter.delivery;

      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      this.queryFilter.categorySlug = category.slug;

      this.queryFilter.cityIds = cityIds;
      this.queryFilter.regionIds = regionIds;
      this.queryFilter.keywords = keywords === "" ? null : keywords;
      this.queryFilter.hasPictures = hasPictures;
      this.queryFilter.hasPrice = hasPrice;
      this.queryFilter.priceRange = priceRange;
      this.queryFilter.origin = origin;
      this.queryFilter.delivery = delivery;
      this.queryFilter.exchange = exchange;

      this.$nextTick(() => this.updateRoute());
    },

    applyCategoryWithDelivery(category) {
      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      this.queryFilter.categorySlug = category.slug;

      this.queryFilter.delivery = "DELIVERY_AVAILABLE";

      this.gotToHeader();

      this.$nextTick(() => this.updateRoute());
    },

    applyAlternative(keywords, categorySlug) {
      this.resetFilter();

      this.queryFilter.fetchActiveCategory = true;

      this.queryFilter.categorySlug = categorySlug;
      this.queryFilter.keywords = keywords === "" ? null : keywords;

      this.$nextTick(() => this.updateRoute(true));
    },

    applyDelivery(delivery) {
      this.queryFilter.delivery = delivery;
      this.queryFilter.page = 1;
      this.$nextTick(() => this.updateRoute());
    }
  },

  computed: {
    filtersForQuery() {
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
        categorySlug:
          this.queryFilter.categorySlug === 0
            ? null
            : this.queryFilter.categorySlug,
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
    notAvailable() {
      return this.notFound === true;
    },

    searchKeywords: {
      get() {
        return this.queryFilter.keywords;
      },
      set(v) {
        this.queryFilter.keywords = v;
      }
    }
  }
};
