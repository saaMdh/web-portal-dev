import {
  defaults,
  filter,
  isArray,
  isEmpty,
  map,
  mapValues,
  pickBy,
  toInteger,
  toPlainObject,
  sortBy
} from "lodash";

function ensureArray(item) {
  if (!isArray(item)) return [item];
  return item;
}

function toBoolean(b) {
  if (typeof b === "boolean") return b;
  return ["1", "true"].includes(b);
}

function ensureArrayInt(item) {
  return map(ensureArray(item), i => parseInt(i));
}

function parseFilterSpecsFromQuery(queryString) {
  const forbiddenKey = [
    "gKeywords",
    "keywords",
    "c",
    "connected",
    "origin",
    "delivery",
    "hasPrice",
    "regionIds",
    "cityIds",
    "priceRangeMin",
    "priceRangeMax",
    "exchange",
    "hasPictures",
    "priceUnit",
    "lang",
    "page",
    "agent_force",
    "agent",
    "utm_source",
    "utm_campaign",
    "utm_medium",
    "fbclid",
    "logout",
    "msclkid"
  ];

  const model = pickBy(queryString, (value, key) => {
    if (forbiddenKey.includes(key)) return false;
    if (/(-dialog|nav-drawer)$/.test(key)) return false;
    return true;
  });

  return mapValues(model, (value, key) => (model[key] = value.toLowerCase()));
}

export default {
  data() {
    return {
      categories: []
    };
  },

  provide() {
    return {
      activeSearchFilter: this.activeSearchFilter
    };
  },

  beforeRouteLeave(to, from, next) {
    if (this.activeSearchFilter.value) {
      this.activeSearchFilter.value = false;
      next(false);
    } else next();
  },
  methods: {
    parseRouteQuery() {
      if (!this.categoryIsCached) this.queryFilter.fetchActiveCategory = true;

      const queryString = defaults(toPlainObject(this.$route.query), {
        gKeywords: null,
        keywords: null,
        c: null,
        connected: false,
        origin: null,
        delivery: null,
        regionIds: [],
        cityIds: [],
        priceRangeMin: null,
        priceRangeMax: null,
        exchange: "false",
        hasPictures: "false",
        hasPrice: "false",
        priceUnit: null
      });

      if (this.$route.params.category) {
        this.queryFilter.categorySlug = this.$route.params.category;
        this.queryFilter.page = this.$route.params.page
          ? toInteger(this.$route.params.page)
          : 1;
      } else {
        this.queryFilter.categorySlug = queryString.c;
        this.queryFilter.page = this.$route.params.page
          ? toInteger(this.$route.params.page)
          : 1;
      }

      this.queryFilter.model = parseFilterSpecsFromQuery(queryString);
      this.queryFilter.connected = toBoolean(queryString.connected);
      this.queryFilter.origin = queryString.origin;
      this.queryFilter.delivery = queryString.delivery;
      this.queryFilter.regionIds = ensureArray(queryString.regionIds);
      this.queryFilter.cityIds = ensureArray(queryString.cityIds);
      this.queryFilter.priceRange = ensureArrayInt([
        queryString.priceRangeMin !== "" ? queryString.priceRangeMin : null,
        queryString.priceRangeMax !== "" ? queryString.priceRangeMax : null
      ]);
      this.queryFilter.hasPrice = queryString.hasPrice;
      this.queryFilter.exchange = queryString.exchange;
      this.queryFilter.hasPictures = queryString.hasPictures;
      this.queryFilter.priceUnit = queryString.priceUnit;

      const keywords =
        queryString.gKeywords !== null
          ? queryString.gKeywords
          : queryString.keywords;

      const cleanKeywords = !isEmpty(keywords) ? keywords.unslugify() : null;

      this.searchKeywords = cleanKeywords;

      this.skipSearch = false;
    },

    updateRoute(alternative = false) {
      let query = {
        keywords: this.searchKeywords,
        connected: this.queryFilter.connected,
        origin: this.queryFilter.origin,
        regionIds: this.queryFilter.regionIds,
        cityIds: this.queryFilter.cityIds,
        delivery: this.queryFilter.delivery,
        hasPrice: this.queryFilter.hasPrice,
        exchange: this.queryFilter.exchange,
        hasPictures: this.queryFilter.hasPictures,
        priceUnit: this.queryFilter.priceUnit,
        ...toPlainObject(this.queryFilter.model)
      };

      if (this.queryFilter.priceRange) {
        const [min, max] = this.queryFilter.priceRange;
        query.priceRangeMin = min;
        query.priceRangeMax = max;
      }
      query = pickBy(query, v => {
        if (isArray(v)) return filter(v).length > 0;
        else if (v === "false") return false;
        else return !!v;
      });

      if (alternative) {
        this.$router
          .push({
            name: "search_category",
            params: {
              category: this.queryFilter.categorySlug,
              page: this.queryFilter.page ? this.queryFilter.page : 1
            },
            query
          })
          .catch(() => {});
        return;
      }

      if (this.$route.name === "search_category") {
        this.$router
          .push({
            name: "search_category",
            params: {
              category: this.queryFilter.categorySlug,
              page: this.queryFilter.page ? this.queryFilter.page : 1
            },
            query
          })
          .catch(() => {});
      } else {
        this.$router
          .push({
            name: "searchP",
            params: {
              page: this.queryFilter.page ? this.queryFilter.page : 1
            },
            query: {
              c: this.queryFilter.categorySlug
                ? this.queryFilter.categorySlug
                : undefined,
              ...query
            }
          })
          .catch(() => {});
      }
    },
    showPixel(context) {
      this.canonicalHref = location.href.includes("lang")
        ? location.href
        : location.href.includes("?")
        ? location.href + "&lang=" + this.locale
        : location.href + "?lang=" + this.locale;
      const params = {
        ...this.$route.params,
        utmSource: this.$route.query.utm_source
          ? this.$route.query.utm_source
          : undefined,
        utmCampain: this.$route.query.utm_campain
          ? this.$route.query.utm_campain
          : undefined,
        utmMedium: this.$route.query.utm_medium
          ? this.$route.query.utm_medium
          : undefined,
        ...context
      };
      // Normalize page params if exits to integer
      if (params.page && !isNaN(parseInt(params.page)))
        params.page = parseInt(params.page);
      if (!this.pixelPayload || !Object.is(this.pixelPayload, params))
        this.pixelPayload = params;
    },
    generateNewPixel() {
      if (
        !this.categories ||
        !this.queryFilter.category.slug ||
        this.categories.length === 0
      )
        return;
      const lastCategory = this.categories[this.categories.length - 1];
      const filterCategory = this.queryFilter.category.slug;
      const paramsCategory = this.$route.params.category;
      if (lastCategory !== filterCategory || lastCategory !== paramsCategory)
        return;
      this.showPixel({
        categories: this.categories,
        category: this.queryFilter.category.slug
      });
    }
  },
  watch: {
    "queryFilter.category": {
      immediate: false,
      handler(newValue, oldValue) {
        if (!newValue || !newValue.slug) return;
        if (newValue.slug === oldValue.slug) return;
        let parentTree = newValue.parentTree || [];
        let categories = [...parentTree, newValue];
        this.categories = sortBy(categories, c => parseInt(c.id)).map(
          c => c.slug
        );
        this.generateNewPixel();
      }
    },
    "$route.params.page": {
      immediate: false,
      async handler(newValue, oldValue) {
        if (!newValue || Object.is(newValue, oldValue)) return;
        this.generateNewPixel();
      }
    },
    "$route.query.keywords": {
      immediate: false,
      async handler(newValue, oldValue) {
        if (!newValue || newValue === oldValue) return;
        this.generateNewPixel();
      }
    }
  }
};
