<template>
  <v-locale-provider :locale="locale" :rtl="locale === 'ar'">
    <v-app class="o-app">
      <snack-bar-status v-if="!IsBotAgent()"></snack-bar-status>
      <template v-if="globalLoader">
        <div class="d-flex justify-center align-center full-h">
          <v-progress-circular
            color="primary"
            size="64"
            width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
      <template v-else-if="health.error === true">
        <div class="d-flex justify-center align-center full-h">
          <div class="text-center text-primary">
            <h1 class="text-h4">(╯°□°）╯︵ ┻━┻</h1>
            <h2 class="text-h5 mt-2">{{ $t("_.connectionProblem") }}</h2>
            <v-btn
              :aria-label="$t('_.refresh')"
              variant="text"
              class="mt-2"
              @click="refresh"
            >
              {{ $t("_.refresh") }}
              <v-icon class="mx-1"> mdi-reload </v-icon>
            </v-btn>
          </div>
        </div>
      </template>

      <template v-else>
        <messenger-drawer
          v-if="renderMessengerDrawer && !DISABLE_MESSENGER"
        ></messenger-drawer>
        <lazy v-if="isPortal" render-on-idle>
          <the-nav-drawer></the-nav-drawer>
        </lazy>
        <div v-if="isPortal" id="insider-drawer"></div>
        <the-top-bar v-if="isPortal" class="d-print-none"></the-top-bar>
        <app-dialogs ref="popup" :token="token" :user="user"></app-dialogs>

        <v-main>
          <div class="o-app__content">
            <pixel-img
              v-if="!!pixelPayload"
              :key="JSON.stringify(pixelPayload)"
              payload-type="page_view"
              :payload="pixelPayload"
              :lazy="false"
            ></pixel-img>

            <router-view v-slot="{ Component }">
              <keep-alive :include="['Search', 'Home', 'Store', 'Builder']">
                <component
                  :is="Component"
                  :key="routeName"
                  :delivery-cat="deliveryCategory"
                />
              </keep-alive>
            </router-view>
          </div>
          <the-footer v-show="isPortal" class="d-print-none"></the-footer>
        </v-main>
        <the-action-bar
          v-if="isPortal && $isMobile"
          class="d-print-none"
        ></the-action-bar>
      </template>
    </v-app>
  </v-locale-provider>
</template>
<script>
import thirdPartyInjector from "./utils/thirdPartyInjector";
thirdPartyInjector();

import { Plugins } from "@capacitor/core";

import env from "./utils/env.js";

import useAppAuth from "@ouedkniss/web-ui-plugin/src/composables/useAppAuth";
import AppHealth from "./mixins/App/AppHealth.js";
import useOrganizationSchema from "@/composables/useOrganizationSchema";

import TheTopBar from "./components/App/TheTopBar";
import TheFooter from "./components/App/TheFooter";
import { mapGetters } from "vuex";
import { IsBotAgent } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";
import without from "lodash/without";
import { isExternalDomain } from "@/utils/location";
import { setProperty } from "@/utils/Style";

import pixelImg from "@/components/Announcement/pixelImg.vue";
import {
  loadRouteWatcher,
  injectGlobalCbRouteWatcher
} from "@/composables/hooks/useRouteWatcher";
import { defineAsyncComponent } from "vue";
const DEFAULT_FONT = '"DroidArabicKufiRegular", "Open Sans", Arial, sans-serif';

const PREVENT_RECORD_FROM = [
  "land-announcement-show",
  "store-announcement-show",
  "announcement_show",
  "search",
  "searchP",
  "search_category",
  "store-annonce"
];

export default {
  name: "App",

  components: {
    pixelImg,
    TheTopBar,
    TheFooter,

    TheNavDrawer: defineAsyncComponent(() =>
      import("./components/App/TheNavDrawer.vue")
    ),
    TheActionBar: defineAsyncComponent(() =>
      import("./components/App/TheActionBar.vue")
    ),
    SnackBarStatus: defineAsyncComponent(() =>
      import("./components/SnackBarStatus.vue")
    ),
    AppDialogs: defineAsyncComponent(() =>
      import("./components/AppDialogs.vue")
    ),
    MessengerDrawer: defineAsyncComponent(() =>
      import("./components/Dialog/MessengerDrawer.vue")
    )
  },

  mixins: [AppHealth],

  provide() {
    return {
      openMessengerDrawer: () => {
        this.renderMessengerDialog = true;
      },
      showMessageBox: props => {
        return this.$refs.popup.openMessageBox(props);
      },
      updateFontFamily: fontFamily => {
        const f_f = fontFamily || DEFAULT_FONT;
        setProperty("--body-font-family", f_f);
      },
      queryUTM: this.queryUTM
    };
  },

  setup() {
    const {
      connectToAuth,
      makeRefreshToken,
      checkExpiredToken,
      locale,
      token,
      user
    } = useAppAuth();
    useOrganizationSchema();
    loadRouteWatcher();
    return {
      connectToAuth,
      makeRefreshToken,
      checkExpiredToken,
      locale,
      token,
      user
    };
  },

  data() {
    return {
      DISABLE_MESSENGER: parseInt(env.VUE_APP_DISABLE_MESSENGER),
      deliveryCategory: null,
      canonicalHref: location.href,
      renderMessengerDrawer: false,
      queryUTM: {
        utm_source: this.$route.query.utm_source
          ? this.$route.query.utm_source
          : undefined,
        utm_medium: this.$route.query.utm_medium
          ? this.$route.query.utm_medium
          : undefined,
        utm_campaign: this.$route.query.utm_campaign
          ? this.$route.query.utm_campaign
          : undefined
      },
      routeWatcher: {
        changedAt: null,
        handler: null
      },
      pixelPayload: null
    };
  },

  head() {
    const alternateLocals = without(["fr", "ar", "en"], this.locale);
    const uri = decodeURI(this.canonicalHref);
    const uriAlternate = uri.slice(0, -2);
    let defUri = new URL(uri);
    defUri.searchParams.delete("lang");

    return {
      title: this.$t("meta.title"),
      titleTemplate:
        this.$route.name === "home"
          ? this.$t("meta.homeTitleTemplate")
          : this.$t("meta.titleTemplate"),
      meta: [
        {
          name: "theme-color",
          content: this.$vuetify.theme.current.dark ? "#272727" : "#ffffff"
        }
      ],
      link: [
        {
          rel: "canonical",
          href: defUri.href
        },
        {
          rel: "alternate",
          hreflang: alternateLocals[0],
          href: uriAlternate + alternateLocals[0]
        },
        {
          rel: "alternate",
          hreflang: alternateLocals[1],
          href: uriAlternate + alternateLocals[1]
        }
      ]
    };
  },
  computed: {
    ...mapGetters({ globalLoader: "globalLoader" }),
    isPortal() {
      return !(
        isExternalDomain() ||
        (this.$route &&
          this.$route.meta &&
          this.$route.meta.middleware === "auth-page") ||
        this.$route.fullPath.startsWith("/store/") ||
        this.$route.fullPath.startsWith("/landing/")
      );
    },
    routeName() {
      if (this.$route.fullPath.startsWith("/store/") || isExternalDomain()) {
        return "store";
      }
      if (this.$route.fullPath.startsWith("/landing/")) {
        return "landing";
      }
      return this.$route.name;
    },
    pixelKey() {
      return JSON.stringify(this.pixelPayload);
    }
  },

  watch: {
    token: {
      immediate: true,
      async handler(token) {
        await this.connectToAuth();
        const isValid = token && !this.checkExpiredToken();
        if (isValid) this.$store.commit("session/setToken", { token });
        this.connectToPlugins(isValid ? this.token : null);

        if (!isValid) {
          this.user = null;
          this.$cart && this.$cart.disconnect();
          this.$notifications && this.$notifications.disconnect();
          if (!parseInt(env.VUE_APP_DISABLE_MESSENGER)) {
            this.$messenger && this.$messenger.disconnect();
          }
        }
      }
    },
    locale: {
      immediate: true,
      handler() {
        let u = new URL(location.href);
        if (!u.searchParams.has("lang")) {
          u.searchParams.set("lang", `${this.locale}`);
        }
        this.canonicalHref = u.href;
      }
    },
    user: {
      immediate: true,
      handler(user) {
        this.$store.commit("session/setUser", { user });
      }
    },
    "user.isValidated": {
      async handler(newValue, oldValue) {
        if (this.user && newValue && oldValue === false) {
          this.makeRefreshToken();
        }
      }
    }
  },
  created() {
    injectGlobalCbRouteWatcher((route, newValue, oldValue) => {
      //watch
      if (Object.is(newValue, oldValue)) return;
      this.GoToTop(newValue, oldValue);
      //add Add UTM codes to track performance to route url
      const filters = {};
      if (this.queryUTM.utm_source)
        filters.utm_source = this.queryUTM.utm_source;
      if (this.queryUTM.utm_medium)
        filters.utm_medium = this.queryUTM.utm_medium;
      if (this.queryUTM.utm_campain)
        filters.utm_campaign = this.queryUTM.utm_campain;

      this.$router
        .replace({
          ...this.$router.currentRoute.value,
          query: {
            ...this.$router.currentRoute.value.query,
            ...filters
          }
        })
        .catch(() => {});

      this.canonicalHref = location.href.includes("lang")
        ? location.href
        : location.href.includes("?")
        ? location.href + "&lang=" + this.locale
        : location.href + "?lang=" + this.locale;
      if (PREVENT_RECORD_FROM.includes(route.name)) return;

      const { page, ...routeParms } = route.params;
      const params = {
        ...routeParms,
        utmSource: route.query.utm_source ? route.query.utm_source : undefined,
        utmCampain: route.query.utm_campain
          ? route.query.utm_campain
          : undefined,
        utmMedium: route.query.utm_medium ? route.query.utm_medium : undefined
      };
      // Normalize page params if exits to integer
      const _page = page || route.query?.page;
      if (_page && !isNaN(parseInt(_page))) params.page = parseInt(_page);

      if (
        this.routeWatcher.changedAt ||
        this.routeWatcher.changedAt + 1000 <= Date.now()
      ) {
        if (this.routeWatcher.handler) {
          clearTimeout(this.routeWatcher.handler);
        }
        this.routeWatcher.changedAt = Date.now();
        let vm = this;
        this.routeWatcher.handler = setTimeout(() => {
          if (!vm.pixelPayload || !Object.is(vm.pixelPayload, params))
            vm.pixelPayload = params;
        }, 1000);
      }

      this.routedAnnoun = null;
    });
  },

  async mounted() {
    const { BackgroundUploadNativePlugin, Storage, Device } = Plugins;

    if (["android", "ios"].includes((await Device.getInfo()).platform)) {
      try {
        BackgroundUploadNativePlugin.addListener(
          "uploadNotificationClick",
          async () => {
            // redirect to announ create
            await Storage.remove({
              key: "NotificationTargetUrl"
            });
            await this.$router.push({
              name: "publish",
              query: { steps: "upload" }
            });
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
    document.getElementById("loading").style.display = "none";

    this.$store.dispatch("app/fetchCategories", this.$apollo);
    this.$store.dispatch("app/setupPopState");
    this.$vuetify.locale.rtl = this.locale === "ar";
    document.documentElement.dir = this.locale === "ar" ? "rtl" : "ltr";

    if (!IsBotAgent()) {
      window.addEventListener("online", () => {
        this.$store.commit("ui/toggleOnLine", true);
      });
      window.addEventListener("offline", () => {
        this.$store.commit("ui/toggleOnLine", false);
      });
    } else this.$store.commit("ui/toggleOnLine", true);
  },

  methods: {
    IsBotAgent: () => IsBotAgent(),
    IsDev: () => env.isDev,
    refresh() {
      window.location = "";
    },
    async connectToPlugins(token) {
      try {
        this.$store.commit("app/setPluginsStatus", "LOADING");
        this.$store.commit("app/setPluginsStatus", "INSTALLED");

        if (token) {
          this.$cart.connect({
            token
          });

          this.$stats.connect({
            token
          });

          this.$notifications.connect({
            token
          });
          if (!parseInt(env.VUE_APP_DISABLE_MESSENGER)) {
            this.$messenger.connect({
              token,
              url: env.VUE_APP_SOCKET_IO
            });
            this.$watch("$messenger.state.active", function () {
              this.renderMessengerDrawer = true;
            });
          }

          this.$store.commit("app/setPluginsStatus", "CONNECTED");
          if (this.$route.params.threadId) {
            this.openMessengerThreadById(this.$route.params.threadId);
          }
        }
      } catch (error) {
        if (env.isDev) console.error(error);
        this.$store.commit("app/setPluginsStatus", "FAILED");
      }
    },
    openMessengerThreadById(threadId) {
      this.$messenger && this.$messenger.openThreadById(threadId);
    },
    GoToTop(to, from) {
      if (to.name !== from.name && from.name !== "announcement_show")
        this.goTo(0, { duration: 100 });
    }
  }
};
</script>

<style lang="scss" src="@/scss/app.scss"></style>
