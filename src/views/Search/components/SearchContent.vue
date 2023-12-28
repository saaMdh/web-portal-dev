<template>
  <div>
    <v-container class="pt-2">
      <!-- Ads : Header banner -->

      <!-- Traver Card -->
      <travel-quote-card
        v-if="showTravelCard"
        class="mb-6 mt-3"
      ></travel-quote-card>

      <!-- Header -->
      <v-row id="search-header" no-gutters class="align-end">
        <v-col cols="12">
          <search-header
            :search="search"
            :has-suggested="suggested.length > 0"
            :model-value="searchKeywords?.unslugify()"
            :regions="regions"
            :loading="
              loading && queryFilter.fetchActiveCategory === true ? true : false
            "
            :cities="cities"
          ></search-header>
        </v-col>

        <v-col cols="12">
          <search-category
            class="mt-4"
            :suggested="suggested.length > 0"
            :search="search"
            :category="queryFilter.category"
            :model-value="queryFilter.keywords"
            @submit="v => applyCategoryWithFilters(v)"
            @submitAlternative="v => $emit('apply-alternative', v)"
          ></search-category>
        </v-col>
        <v-col
          cols="12"
          :md="search.active.category.delivery ? 6 : 12"
          :lg="search.active.category.delivery ? 6 : 12"
          class="d-flex mt-2 mt-md-4 align-center"
        >
          <search-form
            class="flex-grow-1"
            :search="search"
            :model-value="searchKeywords"
            @submit="applyKeywordsWithoutFilters(suggested.length > 0)"
            @update:modelValue="kw => updateKeywords(kw)"
          ></search-form>
          <v-btn
            :aria-label="$t('search.filter.icon')"
            class="ms-2 px-2"
            variant="outlined"
            rounded
            color="primary"
            height="35"
            :size="$isMobile ? 'small' : 'small'"
            @click="filterClick"
          >
            <v-icon>mdi-tune</v-icon>
            {{ $t("search.filter.icon") }}</v-btn
          >
        </v-col>
        <v-col
          v-if="
            search.active.category.delivery &&
            search.active.category.deliveryType !== 'SERVICE'
          "
          cols="12"
          md="6"
          lg="6"
          class="mt-4 mb-md-2"
        >
          <search-filters-top
            :search="search"
            :loading="loading > 0"
            :filter="queryFilter"
            @apply-delivery="v => $emit('apply-delivery', v)"
            @apply-etat="v => $emit('apply-etat', v)"
          ></search-filters-top>
        </v-col>
      </v-row>
      <div style="height: 4px" class="mb-2 mt-2">
        <v-progress-linear
          :active="loading > 0"
          height="4"
          rounded
          indeterminate
        ></v-progress-linear>
      </div>

      <lazy render-on-idle>
        <search-filter-drawer
          ref="filterDrawer"
          :category="queryFilter.category"
          :filter="queryFilter"
          :loading="loading"
          @submit="
            v => applyFilterAndKeywordsWithoutCategory(v, suggested.length > 0)
          "
          @regions="v => (regions = v)"
          @cities="v => (cities = v)"
        ></search-filter-drawer>
      </lazy>
      <!-- List -->
      <div class="search mt-4">
        <div id="search-content">
          <search-view
            class="mt-n1"
            :loading="loading > 0 || loadingSearch"
            :search="search"
            :filter="queryFilter"
            :search-store="searchStore"
            @fetch-more="v => $emit('fetch-more', v)"
            @apply-pagination="v => $emit('apply-pagination', v)"
          ></search-view>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import isEmpty from "lodash/isEmpty";
import reduce from "lodash/reduce";
import get from "lodash/get";
import take from "lodash/take";
import truncate from "lodash/truncate";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import SearchCategory from "./SearchCategory.vue";
import SearchHeader from "./SearchHeader.vue";
import SearchView from "./SearchView.vue";
import { defineAsyncComponent } from "vue";

import useSearchHistory from "@/composables/useSearchHistory";
export default {
  components: {
    SearchCategory,
    SearchHeader,
    SearchView,
    SearchFilterDrawer: defineAsyncComponent(() =>
      import("./SearchFilterDrawer.vue")
    ),
    SearchFiltersTop: defineAsyncComponent(() =>
      import("./SearchFiltersTop.vue")
    ),
    SearchForm: defineAsyncComponent(() => import("./SearchForm.vue")),
    TravelQuoteCard: defineAsyncComponent(() =>
      import("@/components/Travel/TravelQuoteCard.vue")
    )
  },

  props: {
    search: {
      type: Object,
      required: true
    },
    searchStore: {
      type: Object
    },
    queryFilter: {
      type: Object
    },
    searchKeywords: {
      type: String,
      default: ""
    },
    metadataDescription: {
      type: String,
      default: null
    },
    metadataKeywords: {
      type: String,
      default: null
    },
    loading: {
      type: Number,
      default: 0
    },
    loadingSearch: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const {
      logSearch,
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    } = useSearchHistory();
    const { locale } = useAuthFrame();

    return {
      locale,
      logSearch,
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    };
  },
  data() {
    return {
      openfilter: false,
      keywords: null,
      regions: null,
      cities: null,
      searchMetaKeywords: null,
      searchMetaDescription: null
    };
  },
  head() {
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", this.metaDescription);

    const keywords = document.querySelector('meta[name="keywords"]');
    keywords?.setAttribute("content", this.metaKeywords);

    return {
      meta: [
        {
          property: "og:site_name",
          content: "Ouedkniss.com"
        },
        {
          property: "og:image",
          content: get(
            this.search.announcements.data[0],
            "defaultMedia.mediaUrl",
            require("@/assets/default-no-image.svg")
          )
        },
        {
          property: "og:description",
          content: truncate(this.metaDescription, 200)
        },
        {
          property: "og:url",
          content: location.href
        },
        {
          name: "keywords",
          content: this.metaKeywords
        },
        {
          name: "description",
          content: this.metaDescription
        }
      ]
    };
  },

  computed: {
    metaKeywords() {
      return this.metadataKeywords || this.searchMetaKeywords;
    },
    metaDescription() {
      return this.metadataDescription || this.searchMetaDescription;
    },
    suggested() {
      return take(this.search.suggested, 3);
    },
    showTravelCard() {
      if (this.search.active.category.slug !== "voyages") return false;
      if (this.$route.params.page && this.$route.params.page > 1) return false;
      const propertyNames = Object.keys(this.$route.query).filter(
        k => k !== "lang"
      );
      if (propertyNames.length === 0) return true;
      return false;
    }
  },
  watch: {
    search: {
      handler() {
        this.searchMetaKeywords = this.getSearchMetaKeywords();
        this.searchMetaDescription = this.getSearchMetaDescription();
      },
      immediate: true
    }
  },
  methods: {
    getSearchMetaDescription() {
      const announcements = [...this.search.announcements.data].slice(0, 5);
      let items = announcements.map(announ => {
        return {
          title: announ.title,
          price: announ.pricePreview,
          priceUnit: announ.priceUnit
        };
      });

      let announReduced = reduce(
        items,
        (total, item) => {
          return (
            total +
            item.title +
            (item.price
              ? " : " +
                item.price +
                " " +
                this.$t(`announcement.priceUnit.${item.priceUnit}`)
              : "") +
            " | "
          );
        },
        ""
      ).slice(0, -3);

      const description = announReduced.slice(0, 160);
      return description;
    },

    getSearchMetaKeywords() {
      const countryLang = ["Algérie", "Algeria", "الجزائر"];
      var autoKeywords = "";
      let parentTree = this.search.active.category.parentTree || [];
      const country =
        this.locale === "fr"
          ? countryLang[0]
          : this.locale === "en"
          ? countryLang[1]
          : countryLang[2];

      const categories = [...parentTree, this.search.active.category];

      let items = categories.map(cat => {
        return {
          label: cat.name
        };
      });

      const reduced = reduce(
        items,
        (sum, item) => {
          return sum + item.label + " ";
        },
        ""
      );

      if (this.search.active.category.name === "Automobiles") {
        autoKeywords = this.$t("meta.AutomobileMeta") + " ";
      } else {
        autoKeywords = "";
      }

      let keywords = reduced + autoKeywords + country;

      return keywords;
    },
    updateKeywords(kw) {
      this.keywords = kw.slugify();
    },
    applyFilterAndKeywordsWithoutCategory(filter) {
      filter.fetchActiveCategory = false;
      this.$emit(
        "apply-filter-keywords",
        filter,
        this.keywords,
        this.search.active.category.slug
      );
    },
    applyFilterWithoutCategory(filter) {
      filter.fetchActiveCategory = false;
      this.$emit("apply-filter", filter, this.search.active.category.slug);
    },

    applyKeywordsWithoutFilters(hasSuggested) {
      /* eslint-disable */
      if (isEmpty(this.keywords) && hasSuggested) {
        this.$router.push({ name: "home" });
        return;
      }
      this.logSearch(this.keywords);

      //FIXME:Unexpected mutation of "queryFilter" prop  vue/no-mutating-props
      this.queryFilter.fetchActiveCategory = false;
      this.queryFilter.keywords = null;
      if (this.queryFilter.categorySlug === null)
        this.queryFilter.fetchActiveCategory = true;

      this.$emit(
        "apply-keywords",
        this.keywords,
        !hasSuggested ? this.search.active.category.slug : null
      );
    },

    applyCategoryWithFilters(category) {
      this.queryFilter.fetchActiveCategory = true;
      this.$emit("apply-category", category);
    },
    filterClick: function () {
      this.$refs.filterDrawer.showFilter();
    }
  }
};
</script>
