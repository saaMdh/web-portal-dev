import toInteger from "lodash/toInteger";
import toString from "lodash/toString";
import get from "lodash/get";

import { mapGetters } from "vuex";

import Queries from "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserQuery.graphql";
import debounce from "lodash/debounce";
import env from "@/utils/env";

export default {
  data() {
    return {
      pagination: { page: 1 },
      itemCount: 24,

      items: {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      },

      filter: {
        searchKeywords: "",
        categorySlug: null
      },
      firstMount: true,
      preventWatcher: true,

      loading: 0
    };
  },
  inject: ["queryUTM"],

  mounted() {
    this.parseRouteQuery();
    this.fetchAnnouncementBrowser();
    window.addEventListener("popstate", this.delayParseRouteQuery);
  },
  beforeUnmount() {
    window.removeEventListener("popstate", this.delayParseRouteQuery);
  },

  computed: {
    ...mapGetters({
      store: "builder/store",
      currentPage: "builder/currentPage"
    })
  },

  methods: {
    delayParseRouteQuery() {
      const vm = this;
      setTimeout(() => {
        vm.parseRouteQuery();
      }, 200);
    },
    parseRouteQuery() {
      this.preventWatcher = true;
      const queryRoute = get(this.$route, "query");
      this.filter = {
        searchKeywords: toString(get(queryRoute, "q", "")),
        categorySlug: toString(get(queryRoute, "category", null))
      };
      this.pagination = { page: toInteger(get(queryRoute, "page", 1)) };
      this.setPageRoute();
      const vm = this;
      setTimeout(() => {
        vm.preventWatcher = false;
      }, 500);
    },
    routerQuery(searchKeywords, categorySlug, page) {
      let query = {};
      if (searchKeywords) query.q = searchKeywords;
      if (categorySlug) query.category = categorySlug;
      if (page) query.page = page;
      else query.page = 1;

      if (this.queryUTM.utm_source) query.utm_source = this.queryUTM.utm_source;
      if (this.queryUTM.utm_medium) query.utm_medium = this.queryUTM.utm_medium;
      if (this.queryUTM.utm_campain)
        query.utm_campaign = this.queryUTM.utm_campain;
      return query;
    },
    setPageRoute: debounce(function () {
      if (this.$route.meta.hasAnnounBrowser) {
        this.fetchAnnouncementBrowser();
        this.$router
          .replace({
            path: this.$route.path,
            query: this.routerQuery(
              this.filter.searchKeywords,
              this.filter.categorySlug,
              this.pagination.page
            )
          })
          .catch(() => {});
      }
    }, 200),
    async fetchAnnouncementBrowser() {
      if (!get(this.store, "id")) return;
      try {
        this.loading = 1;
        const { data } = await this.$apollo.query({
          fetchPolicy: "network-only",
          query: Queries.AnnouncementBrowser,
          variables: {
            q: this.filter.searchKeywords,
            filter: {
              page: this.pagination.page,
              count: this.itemCount,
              storeId: get(this.store, "id"),
              categorySlug: this.filter.categorySlug || undefined
            }
          }
        });
        this.items = get(data, "search.announcements", []);
        this.loading = 0;
        window.scrollTo(0, 0);
      } catch (error) {
        this.loading = 0;
        if (env.isDev) console.error(error);
      }
    }
  },

  watch: {
    "pagination.page": {
      deep: true,
      handler() {
        if (this.preventWatcher) return;
        this.setPageRoute();
      }
    },
    filter: {
      deep: true,
      handler() {
        if (this.preventWatcher) return;
        if (this.firstMount) this.firstMount = false;
        else
          this.pagination = {
            page: 1
          };
        this.setPageRoute();
      }
    },
    $route: {
      deep: true,
      handler(newValue, oldValue) {
        const shouldResetFilters =
          oldValue.name !== newValue.name &&
          oldValue.name !== "store-announcement-show" &&
          oldValue.name !== "land-announcement-show" &&
          this.currentPage.slug === newValue.name;

        if (shouldResetFilters || newValue.params.reset) {
          this.pagination = { page: 1 };
          this.filter = {
            searchKeywords: "",
            categorySlug: null
          };
        } else if (this.filter.categorySlug !== newValue.query.category) {
          this.filter.categorySlug = newValue.query.category;
        }
      }
    }
  }
};
