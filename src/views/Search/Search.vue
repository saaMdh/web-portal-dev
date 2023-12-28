<template>
  <div class="search-page">
    <template v-if="notAvailable">
      <search-not-found
        :model-value="queryFilter.keywords"
        @submit="applyGkeywords"
      ></search-not-found>
    </template>
    <template v-else-if="error">
      <div
        v-if="onLine == false"
        class="o-wrong-turn d-flex justify-center align-center mt-16"
      >
        <div class="text-center text-primary px-4">
          <v-icon x-size="large">mdi-wifi-remove</v-icon>
          <h2 class="text-h5 mt-4">{{ $t("_.offLine") }}</h2>
          <v-btn
            :aria-label="$t('announcement.notFound.2')"
            variant="text"
            rounded
            class="mt-4"
            :to="{ name: 'home' }"
            exact
          >
            <v-icon start>mdi-home</v-icon> {{ $t("announcement.notFound.2") }}
          </v-btn>
        </div>
      </div>
      <div v-else class="o-search-nf">
        <div class="text-center text-primary px-4">
          <h1 class="text-h2">(⌐■_■)</h1>
          <h2 class="text-h5 mt-4">{{ $t("search.error") }}</h2>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="search-top" :class="cover ? 'cover' : ''">
        <promo-cover
          v-if="$isDesktop"
          location="DESKTOP_LISTING_COVER"
          :category="miniCategory"
          :no-adsense="noAdsense"
          @finish="v => (cover = v)"
        ></promo-cover>
        <div class="search-top-1">
          <search-carousel
            :no-adsense="noAdsense"
            :cover="cover"
            :slug="slug"
            :search-active="search && search.active"
          ></search-carousel>
        </div>
        <div
          v-show="displayTopAnnoun"
          class="search-top-2 search-top-announcements"
        >
          <v-container class="pt-1 pb-0">
            <!-- Ads : Top Announ -->
            <search-top-announ
              :cover="cover"
              :category="miniCategory"
            ></search-top-announ>
          </v-container>
        </div>
      </div>
      <div class="search-top-3">
        <v-container class="py-2">
          <div id="promo-header" class="search-promo-header">
            <promo-loader
              v-if="$isDesktop"
              location="DESKTOP_LISTING_HEADER"
              :category="miniCategory"
              :no-adsense="noAdsense"
              width="1300"
              height="150"
              class="mx-auto"
            ></promo-loader>

            <promo-loader
              v-if="$isMobile"
              location="MOBILE_LISTING_HEADER"
              :category="miniCategory"
              :no-adsense="noAdsense"
              width="360"
              height="90"
              class="mx-auto"
            ></promo-loader>
          </div>
        </v-container>
      </div>
      <template v-if="!error && search && search.active">
        <search-content
          :search="search"
          :search-store="searchStore"
          :query-filter="queryFilter"
          :search-keywords="searchKeywords"
          :metadata-keywords="metadataKeywords"
          :metadata-description="metadataDescription"
          :loading="loading"
          :loading-search="$apollo.queries.search.loading"
          @apply-category="applyCategory"
          @apply-alternative="v => applyAlternative(v.keywords, v.category)"
          @apply-delivery="applyDelivery"
          @apply-keywords="applyKeywords"
          @apply-filter="applyFilter"
          @apply-filter-keywords="applyFilterAndKeywords"
          @apply-etat="applyEtat"
          @apply-pagination="applyPagination"
        ></search-content>
        <pixel-img
          v-if="!!pixelPayload"
          :key="pixelKey"
          payload-type="page_view"
          :payload="pixelPayload"
          :lazy="false"
        ></pixel-img>
        <v-container v-if="$isMobile" class="pb-6">
          <div id="promo-header" class="search-promo-footer">
            <promo-loader
              location="MOBILE_LISTING_FOOTER"
              :category="miniCategory"
              :no-adsense="noAdsense"
              width="360"
              height="90"
              class="mx-auto"
            ></promo-loader>
          </div>
        </v-container>
      </template>
      <template v-else>
        <div class="search-content-loader my-5">
          <v-progress-circular
            class="spinner"
            color="primary"
            size="64"
            width="2"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import upperFirst from "lodash/upperFirst";
import some from "lodash/some";
import get from "lodash/get";
import PromoLoader from "@/components/Promotion/PromoLoader.vue";
import SearchCarousel from "./components/SearchCarousel.vue";
import SearchNotFound from "./components/SearchNotFound.vue";
import SearchContent from "./components/SearchContent.vue";
import SearchQuery from "./mixins/SearchQuery";
import SearchStore from "./mixins/SearchStore";
import SearchRouting from "./mixins/SearchRouting";
import { mapGetters } from "vuex";
import pixelImg from "@/components/Announcement/pixelImg.vue";
import { defineAsyncComponent } from "vue";
import useSearchHistory from "@/composables/useSearchHistory";
import { getMeta } from "@/api/seo";
export default {
  name: "Search",
  components: {
    pixelImg,
    SearchCarousel,
    PromoLoader,
    SearchNotFound,
    SearchContent,
    SearchTopAnnoun: defineAsyncComponent(() =>
      import("./components/SearchTopAnnoun.vue")
    ),
    PromoCover: defineAsyncComponent(() =>
      import("@/components/Promotion/PromoCover")
    )
  },

  mixins: [SearchQuery, SearchStore, SearchRouting],
  beforeRouteUpdate(to, from, next) {
    this.showLoader = false;
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const cachedSearchSlug = get(vm, "search.active.category.slug", null);
      const routeSlug = get(to, "params.category", null);

      if (!cachedSearchSlug || !routeSlug) {
        vm.categoryIsCached = false;
        return;
      }
      if (from.name == "announcement_show" && cachedSearchSlug === routeSlug)
        vm.categoryIsCached = true;
      else vm.categoryIsCached = false;
    });
  },
  props: {
    deliveryCat: {
      type: Object,
      default: null
    }
  },
  setup() {
    const {
      logSearch,
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    } = useSearchHistory();
    return {
      logSearch,
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    };
  },
  data() {
    return {
      cover: false,
      showLoader: true,
      pixelPayload: null,
      categoryIsCached: false,
      metadataKeywords: null,
      metadataDescription: null
    };
  },

  head() {
    if (!this.search || !this.search.active) return {};

    return {
      title: `${upperFirst(this.searchKeywords)} ${
        this.queryFilter.categorySlug !== null
          ? this.search.active.category.name
          : ""
      }`,
      meta: [
        {
          property: "og:title",
          content:
            this.queryFilter.categorySlug === null
              ? upperFirst(this.searchKeywords)
              : this.search.active.category.name
        },
        {
          property: "og:site_name",
          content: "Ouedkniss.com"
        },
        {
          property: "og:url",
          content: location.href
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["onLine"]),
    displayTopAnnoun() {
      const propertyNames = Object.keys(this.$route.query).filter(
        k => k !== "lang"
      );
      if (propertyNames.length === 0) return true;
      return false;
    },
    slug() {
      return (
        this.$route.params.category ||
        get(this.search, "active.category.slug", "")
      );
    },
    miniCategory() {
      const id = this.slug ? "" : get(this.search, "active.category.id", "");
      return {
        required: true,
        id,
        slug: this.slug
      };
    },
    noAdsense() {
      return some(this.search.announcements.data, a => a.noAdsense);
    },
    pixelKey() {
      return JSON.stringify(this.pixelPayload);
    }
  },
  watch: {
    search() {
      if (this.slug || (this.search && this.search.active))
        this.bindPromoDialogs();
    },
    deliveryCat() {
      if (this.deliveryCat !== null)
        this.applyCategoryWithDelivery(this.deliveryCat);
    },
    async onLine(val, oldVal) {
      if (oldVal === null) return;
      if (val) {
        this.$apollo.queries.search.refetch();
        this.error = null;
      }
    }
  },
  activated() {
    this.parseRouteQuery();
    window.addEventListener("popstate", this.delayParseRouteQuery);
    this.injectCbRouteWatcher(route => {
      this.getMetaData(route);
    });
  },
  deactivated() {
    this.clearCbRouteWatcher();
    window.removeEventListener("popstate", this.delayParseRouteQuery);
    this.$store.commit("dialog/setFlash", {});
    this.$store.commit("dialog/setInterstitial", {});
    if (this.$route.name !== "announcement_show") {
      const myKey = get(this, "$.vnode.key");
      const keepAlive = get(this, "$parent.$.vnode.component");
      keepAlive.__v_cache.delete(myKey);
    }
  },
  methods: {
    //sync url with route parameters
    delayParseRouteQuery() {
      const vm = this;
      setTimeout(() => {
        vm.parseRouteQuery();
      }, 200);
    },

    async getMetaData(route) {
      this.metadataKeywords = null;
      this.metadataDescription = null;
      const slug = route.params.category || route.query.c;
      const query = route.query.keywords;
      const response = await getMeta(slug, query);
      if (response.keywords) this.metadataKeywords = response.keywords;
      if (response.description) this.metadataDescription = response.description;
    },

    bindPromoDialogs() {
      const PREFIX_LOCATION = `${this.$isDesktop ? "DESKTOP" : "MOBILE"}`;
      const options = {
        width: this.$isDesktop ? 900 : 360,
        height: this.$isDesktop ? 470 : 640,
        noAdsense: this.noAdsense,
        category: {
          required: true,
          id: !this.slug ? get(this.search, "active.category.id", "") : "",
          slug: this.slug
        }
      };

      if (this.$isDesktop)
        this.$store.commit("dialog/setFlash", {
          key: `${PREFIX_LOCATION}_LISTING_FLASH_${this.noAdsense}`,
          location: `${PREFIX_LOCATION}_LISTING_FLASH`,
          ...options
        });
      this.$store.commit("dialog/setInterstitial", {
        location: `${PREFIX_LOCATION}_LISTING_INTERSTITIAL`,
        key: `${PREFIX_LOCATION}_LISTING_INTERSTITIAL_${this.noAdsense}`,
        ...options
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/responsive";
.search-top.cover {
  @include isDesktop {
    padding-top: 190px;
    height: 770px;
    .search-top-1,
    .search-top-2 {
      z-index: 3;
      width: 960px;
      margin: 0 auto;
      position: relative;
    }
  }
}
.o-search-nf {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 4px * 4;
  height: calc(100vh - 64px);
  h3 {
    font-size: 2vw;
  }
}

.v-theme--light {
  .search-top-1 {
    background: #ebebeb;
  }
  .search-top-2 {
    background: linear-gradient(#f5f5f5, #f5f5f5, #f5f5f5, #f0f0f0);
  }
  .search-top-3 {
    background: #f0f0f0;
  }
}
.v-theme--dark {
  .search-top-1 {
    background: #191919;
  }
  .search-top-2 {
    background: #151515;
  }
  .search-top-3 {
    background: #151515;
  }
}

.search-top-1 {
  @include isLG {
    height: 274px;
  }
  @include isMD {
    height: 274px;
  }
  @include isSM {
    height: calc(((100vw) / 2.1677) + 24px);
  }
  @include isXS {
    height: calc(((100vw) / 2.1677) + 24px);
  }
}
.search-top-announcements {
  height: 282px;
}
.search-promo-header,
.search-promo-footer {
  @include isLG {
    height: 150px;
  }
  @include isMD {
    height: 150px;
  }
  @include isSM {
    height: 90px;
  }
  @include isXS {
    height: 90px;
  }
}

.search-content-loader {
  text-align: center;
  .spinner {
    margin: 0 auto;
  }
}
</style>
