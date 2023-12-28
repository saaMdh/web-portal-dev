import {
  DefaultRoutes,
  DefaultStoreRoute,
  DefaultStoreRouteExternalDomain
} from "@/router";

import {
  generatePage,
  omitTypename,
  parseIdFromUrl,
  refactorBlock
} from "@/utils/site-build";

import Queries from "@/views/SiteBuilder/Queries.graphql";
import { SetPrimaryColor } from "@/plugins/vuetify";

import { colorToHex, colorNameToHex } from "@/utils/colors";
import { isExternalDomain, isLandingPath, isStorePath } from "@/utils/location";
import { LandingName, LandingType } from "@/utils/LandingSite";
import env from "@/utils/env.js";

import cloneDeep from "lodash/cloneDeep";
import defaults from "lodash/defaults";
import isEqual from "lodash/isEqual";
import find from "lodash/find";
import get from "lodash/get";
import mitt from "mitt";
import { createRouter, createWebHistory } from "vue-router";
import { sync } from "vuex-pathify";
import slugify from "slugify";

const apiEvents = mitt();

export default {
  provide() {
    return {
      restoreSiteBuild: this.restoreSiteBuild,
      commitSiteBuild: this.commitSiteBuild,
      publishSiteBuild: this.publishSiteBuild,
      fetchSiteBuild: this.fetchSiteBuild,
      loadSiteBuild: this.loadSiteBuild,
      rebuildPageRoutes: this.rebuildPageRoutes,
      updateAppTheme: this.updateAppTheme,
      apiEvents
    };
  },

  activated() {
    this.updateAppTheme();
    if (this.isFreshEntry()) this.fetchSiteBuild();
    else this.syncBuild();
  },
  deactivated() {
    this.updateFontFamily();
    SetPrimaryColor(this);
    this.$vuetify.theme.current.dark = this.darkMode;
  },
  computed: {
    ...sync({
      user: "builder/user",
      siteBuild: "builder/siteBuild",
      currentPageIndex: "builder/currentPageIndex",
      baseUrl: "builder/baseUrl",
      landingType: "builder/landingType",
      backup: "builder/backup",
      editorNotice: "builder/editor@notice",
      editorEnable: "builder/editor@enable",
      editorDirty: "builder/editor@dirty"
    })
  },
  data() {
    return {
      routes: []
    };
  },
  watch: {
    $route() {
      const middleware = get(this.$route, "meta.middleware", null);
      if (middleware !== "builder-page") return;

      const logout_refresh = get(this.$route, "meta.logout_refresh", null);
      if (logout_refresh) {
        this.editorEnable = false;
        this.fetchSiteBuild();
        this.$route.meta.logout_refresh = null;
      }

      if (!this.isFreshEntry()) this.updateCurrentPageFromRoute();
    },
    user: {
      deep: true,
      handler(newValue, oldValue) {
        const middleware = get(this.$route, "meta.middleware", null);
        if (middleware !== "builder-page") return;
        if (!isEqual(newValue, oldValue)) {
          this.editorEnable = false;
          this.fetchSiteBuild();
        }
      }
    },
    siteBuild: {
      deep: true,
      handler() {
        if (!this.editorEnable) return;
        if (!this.editorDirty) this.editorDirty = true;
      }
    }
  },

  methods: {
    restoreSiteBuild() {
      this.loadSiteBuild(this.backup);
    },

    async commitSiteBuild() {
      this.editorNotice.update.loading++;

      try {
        await this.$store.dispatch(
          "builder/uploadSiteBuild",
          {
            apolloClient: this.$apollo
          },
          { root: true }
        );

        this.editorDirty = false;

        apiEvents.emit("updateComplete");
      } catch (error) {
        // eslint-disable-next-line
        console.warn(`[Save] Build commit error`, error);
      }

      this.editorNotice.update.loading--;
    },

    async publishSiteBuild() {
      this.editorNotice.publish.loading++;

      try {
        await this.$store.dispatch("builder/publishSiteBuild", {
          apolloClient: this.$apollo
        });
        apiEvents.emit("publishComplete");
      } catch (error) {
        // eslint-disable-next-line
        console.warn(`[Save] Build publish error`, error);
      }

      this.editorNotice.publish.loading--;

      this.$nextTick(() => (this.editorNotice.publish.notify = true));
    },

    async fetchSiteBuild() {
      this.editorNotice.fetch.loading++;
      try {
        const url = new URL(env.VUE_APP_OUEDKNISS_STORE);
        if (
          url.hostname.includes(location.hostname) ||
          location.hostname.includes(url.hostname)
        ) {
          // TODO: fix landing path

          if (
            isExternalDomain() ||
            this.$route.fullPath.startsWith("/store/")
          ) {
            const { id, slug } = parseIdFromUrl();
            await this.fetchSiteBuildByStore({ id, slug });
          } else if (this.$route.fullPath.startsWith("/landing/")) {
            const { id, slug } = parseIdFromUrl();
            await this.fetchSiteBuildByMarket({ id, slug });
          }
        } else {
          await this.fetchSiteBuildByDomain(location.hostname);
        }

        this.updateCurrentPageFromRoute();
      } catch (error) {
        const code =
          get(error.graphQLErrors, "[0].exception.code", null) ||
          get(error, "code", null);

        if (code && code == "404") this.editorNotice.fetch.notFound = true;
        else this.editorNotice.fetch.hasError = true;
        console.warn(`[Load] Build fetch error`, error);
      }

      this.editorNotice.fetch.loading--;
    },

    async fetchSiteBuildByStore({ id }) {
      const { data } = await this.$apollo.query({
        query: Queries.FetchByStore,
        fetchPolicy: "network-only",
        variables: {
          id: parseInt(id)
        }
      });
      const _slug =
        data.siteBuild.land.slug ||
        slugify(`${data.siteBuild.land[LandingName]}`, {
          lower: true
        });

      this.$store.commit("builder/setBaseUrl", `/store/${id}/${_slug}`);
      this.$store.commit("builder/setLandingType", "store");
      if (
        !get(this.user, "isAdmin", false) &&
        data.siteBuild.land.status !== "ACTIVE"
      )
        throw {
          message: "Error: The requested store ID cannot be found",
          code: "404"
        };
      this.loadSiteBuild(data.siteBuild, { parseBlockAttr: true });
    },

    async fetchSiteBuildByDomain(domain) {
      const { data } = await this.$apollo.query({
        query: Queries.FetchByDomain,
        fetchPolicy: "network-only",
        variables: {
          domain: domain.replace("www.", "")
        }
      });
      this.$store.commit("builder/setBaseUrl", `/`);
      this.$store.commit("builder/setLandingType", "store");

      this.loadSiteBuild(data.siteBuild);
    },

    async fetchSiteBuildByMarket({ id }) {
      const { data } = await this.$apollo.query({
        query: Queries.FetchByMarket,
        fetchPolicy: "network-only",
        variables: {
          id: parseInt(id)
        }
      });
      const _slug =
        data.siteBuild.land.slug ||
        slugify(`${data.siteBuild.land[LandingName]}`, {
          lower: true
        });

      this.$store.commit("builder/setBaseUrl", `/landing/${id}/${_slug}`);
      this.$store.commit("builder/setLandingType", "market");

      this.loadSiteBuild(data.siteBuild, { parseBlockAttr: true });
    },

    async loadSiteBuild(build, opts = {}) {
      defaults(opts, {
        parseBlockAttr: false,
        recordBackup: true
      });

      build = omitTypename(build);

      this.refactorBlocks(build);

      this.ensureMandatoryPages(build);

      this.rebuildPageRoutes(build);

      this.$store.commit("builder/setSiteBuild", build);
      this.$store.commit("builder/updatePermission");

      this.updateAppTheme();

      if (opts.recordBackup) {
        this.$store.commit("builder/setBackup", cloneDeep(build));
      }
    },

    syncBuild() {
      this.updateAppTheme();
    },

    refactorBlocks(build) {
      for (const page of build.pages) {
        for (let i = 0; i < page.blocks.length; i++) {
          page.blocks[i] = refactorBlock(page.blocks[i]);
        }
      }
    },

    ensureMandatoryPages(build) {
      const defaultPages =
        LandingType() === "store"
          ? ["home", "search", "single"]
          : ["home", "single"];
      const pages = {
        ar: {
          home: "الصفحة الرئيسية",
          search: "بحث",
          single: "إعلان"
        },
        en: {
          home: "Home",
          search: "Search",
          single: "announcement"
        },
        fr: {
          home: "Accueil",
          search: "Recherche",
          single: "Annonce"
        }
      };

      defaultPages.forEach(pageType => {
        if (!find(build.pages, p => p.type === pageType)) {
          const title = {
            ar: pages.ar[pageType],
            fr: pages.fr[pageType],
            en: pages.en[pageType]
          };
          const page = generatePage(title, pageType);
          build.pages.push(page);
        }
      });
    },

    rebuildPageRoutes(build) {
      const newRouter = createRouter({
        history: createWebHistory(env.BASE_URL),
        routes: []
      });
      this.$router.matcher = newRouter.matcher;

      this.routes = build.pages.map((page, index) => {
        return {
          path: page.slug,
          meta: {
            pageIndex: index,
            middleware: "builder-page",
            hasAnnounBrowser: page.blocks.some(
              block => block.type === "AnnounBrowserBlock"
            )
          },
          name: `${isStorePath(this.$route) ? "store" : "land"}-${page.slug}`,
          props: true,
          component: () =>
            import(
              /* webpackChunkName: "builder" */ "../../views/SiteBuilder/Builder.vue"
            )
        };
      });

      build.pages.forEach((page, index) => {
        if (page.type === "single")
          this.routes.push({
            name: `${
              isStorePath(this.$route) ? "store" : "land"
            }-announcement-show`,
            path: `${page.slug}/:id`,
            meta: { pageIndex: index, middleware: "builder-page" },
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "builder" */ "../../views/SiteBuilder/Builder.vue"
              )
          });

        if (page.type === "search")
          this.routes.push({
            name: `${
              isStorePath(this.$route) ? "store" : "land"
            }-announcement-search`,
            path: `${page.slug}`,
            meta: {
              pageIndex: index,
              middleware: "builder-page",
              hasAnnounBrowser: true
            },
            props: true,
            component: () =>
              import(
                /* webpackChunkName: "builder" */ "../../views/SiteBuilder/Builder.vue"
              )
          });
      });

      this.routes.push({
        path: ":page",
        name: `${isStorePath(this.$route) ? "store" : "land"}-page`,
        meta: {
          middleware: "builder-page"
        },
        component: () =>
          import(
            /* webpackChunkName: "builder" */ "../../views/SiteBuilder/Builder.vue"
          )
      });

      let storeRoutes = isExternalDomain()
        ? [...DefaultStoreRouteExternalDomain, ...DefaultRoutes]
        : [...DefaultStoreRoute, ...DefaultRoutes];

      let routeParentName = "store";
      if (isStorePath(this.$route)) routeParentName = storeRoutes[0].name;
      if (isLandingPath(this.$route)) routeParentName = storeRoutes[2].name;
      //if we navigate to defirent store vue-router will replace matched new route
      //TODO:check unmatched old ones
      this.routes.forEach(route => {
        this.$router.addRoute(routeParentName, route);
      });
    },
    updateAppTheme() {
      if (this.siteBuild === null || this.siteBuild.theme === null) return;
      const primaryColor = colorToHex(
        colorNameToHex(this.siteBuild.theme.color)
      );
      this.$vuetify.theme.current.dark = this.siteBuild.theme.dark;
      SetPrimaryColor(this, primaryColor);
    },

    updateCurrentPageFromRoute() {
      let currentSlug = isStorePath(this.$route)
        ? this.$route.params.storeSlug
        : this.$route.params.landSlug;
      let realSlug = isStorePath(this.$route)
        ? this.store.slug
        : this.market.marketName.toLowerCase();
      const STORE_NAME_PREFIX = isStorePath(this.$route) ? "store" : "land";
      const DEFAULT_ROUTE_NAME = [
        STORE_NAME_PREFIX,
        `${STORE_NAME_PREFIX}-page`,
        `${STORE_NAME_PREFIX}-annonce`
      ];

      if (
        currentSlug &&
        realSlug &&
        slugify(currentSlug) !== slugify(realSlug)
      ) {
        this.$router.replace({
          name: STORE_NAME_PREFIX,
          params: isStorePath(this.$route)
            ? {
                storeId: this.$route.params.storeId,
                storeSlug: slugify(realSlug)
              }
            : {
                landId: this.$route.params.landId,
                landSlug: slugify(realSlug)
              }
        });
      } else if (
        this.$route.meta.pageIndex === undefined &&
        DEFAULT_ROUTE_NAME.includes(this.$route.name)
      ) {
        //replace static routes with dynamic routes after fetching pages
        //set default query (page:1) & meta (hasAnnounBrowser)
        this.$store.commit("builder/setCurrentPageIndex", 0);

        const currentRoute = this.$router.currentRoute.value;
        const query = { ...currentRoute.query };
        const params = { ...currentRoute.params };
        const meta = { ...currentRoute.meta };

        let name = "";
        let hasAnnounBrowser = false;

        if (currentRoute.name === "store") {
          const page = this.siteBuild.pages[0];
          hasAnnounBrowser = page.blocks.some(
            block => block.type === "AnnounBrowserBlock"
          );
          if (hasAnnounBrowser) {
            meta["hasAnnounBrowser"] = true;
            query["page"] = 1;
          }

          name = `${STORE_NAME_PREFIX}-${page.slug}`;
        } else if (currentRoute.name === "store-annonce")
          name = `${STORE_NAME_PREFIX}-announcement-show`;
        else if (currentRoute.params.page) {
          name = `${STORE_NAME_PREFIX}-${currentRoute.params.page}`;
          const page = this.siteBuild.pages.find(
            p => p.slug === currentRoute.params.page
          );
          hasAnnounBrowser = page.blocks.some(
            block => block.type === "AnnounBrowserBlock"
          );
          if (hasAnnounBrowser) {
            meta["hasAnnounBrowser"] = true;
            query["page"] = 1;
          }
        } else name = currentRoute.name;

        this.$router.replace({ name, params, query });
      } else if (this.$route.meta.pageIndex === undefined) {
        this.$store.commit("builder/setCurrentPageIndex", 0);
      } else {
        this.$store.commit(
          "builder/setCurrentPageIndex",
          this.$route.meta.pageIndex
        );
      }
    },
    isFreshEntry() {
      return !this.baseUrl || !location.pathname.includes(this.baseUrl);
    }
  }
};
