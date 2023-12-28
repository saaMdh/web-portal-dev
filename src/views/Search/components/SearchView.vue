<template>
  <div class="search-view" :class="{ '--loading': loading }">
    <search-square-ad
      v-if="
        displayFrontStore &&
        searchStore.data.length === 0 &&
        search.announcements.data.length > 6
      "
      :key="search.active.category.id"
      :category-id="search.active.category.id"
      :ignore="searchStore.data.length > 0"
      class="mb-3"
    ></search-square-ad>

    <template v-if="search.announcements.data.length > 0">
      <json-ld v-if="jsonld" :jsonld="jsonld" type="itemlist"></json-ld>

      <template v-if="searchStore.data.length > 0">
        <v-row v-if="searchStore.data.length === 1" dense>
          <v-col cols="12" sm="6" lg="3" md="4">
            <search-view-item
              :item="head[0]"
              :category="search.active.category"
              class="mb-1"
            ></search-view-item>
          </v-col>
        </v-row>
        <swiper
          v-else
          v-slot="{ item }"
          :items="head"
          :space-between="2"
          :slides-per-view="
            $r({
              xs: 1.1,
              sm: 2.1,
              md: 3.5,
              lg: 4
            })
          "
          :navigation="$isDesktop"
          class="mx-n1"
        >
          <div class="pa-1">
            <store-card-full :store="item"></store-card-full>
          </div>
        </swiper>
      </template>
      <v-row v-else dense>
        <v-col
          v-for="item in head"
          :key="item.id"
          cols="12"
          sm="6"
          lg="3"
          md="4"
        >
          <search-view-item
            :item="item"
            :category="search.active.category"
          ></search-view-item>
        </v-col>
      </v-row>

      <search-view-item
        v-if="firstAd && search.announcements.data.length > 6"
        class="py-1"
        :item="firstAd"
        :category="search.active.category"
        :no-adsense="noAdsense"
      ></search-view-item>
      <v-row dense>
        <v-col
          v-for="(item, index) in rest"
          :key="item.id"
          cols="12"
          :sm="item.fullWidth ? 12 : 6"
          :md="item.fullWidth ? 12 : 4"
          :lg="item.fullWidth ? 12 : 3"
        >
          <search-view-item
            class="search-view-item"
            :item="item"
            :index="index"
            :category="search.active.category"
          ></search-view-item>
        </v-col>
      </v-row>
      <div
        v-if="search.announcements.paginatorInfo.lastPage > 1"
        class="d-flex justify-center align-center mt-4 mb-2"
      >
        <pagination
          v-model="page"
          :length="search.announcements.paginatorInfo.lastPage"
          :disabled="loading"
          @update:model-value="applyPagination"
        ></pagination>
      </div>
    </template>

    <template v-else>
      <v-alert color="primary" variant="text" prominent>
        <template #prepend>
          <v-icon v-if="$isDesktop"> mdi-magnify </v-icon>
        </template>
        <div class="text-h5">{{ $t("search.notFound.0") }}</div>

        <div class="mt-2">
          {{ $t("search.notFound.1") }}<br />{{ $t("search.notFound.2")
          }}<br />{{ $t("search.notFound.3") }}
        </div>
      </v-alert>
    </template>
  </div>
</template>

<script>
import get from "lodash/get";
import shuffle from "lodash/shuffle";
import some from "lodash/some";
import toInteger from "lodash/toInteger";

import { PromoFeedListQuery } from "../Search.graphql";
import jsonLd from "@/components/jsonLd.vue";
import { defineAsyncComponent } from "vue";
import Pagination from "@/components/Pagination.vue";
import BuildUrl from "build-url";
import env from "@/utils/env";
export default {
  components: {
    jsonLd,
    Pagination,
    SearchSquareAd: defineAsyncComponent(() => import("./SearchSquareAd.vue")),
    SearchViewItem: defineAsyncComponent(() => import("./SearchViewItem.vue")),
    StoreCardFull: defineAsyncComponent(() =>
      import("@/components/Store/StoreCardFull.vue")
    ),
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },
  props: {
    search: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
      required: true
    },

    searchStore: {
      type: Object,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      promos: [],
      firstAd: null
    };
  },

  computed: {
    jsonld() {
      if (get(this.search, "announcements.data.length", 0) === 0) return null;
      return {
        itemListElement: this.search.announcements.data.map((v, i) => ({
          position: i + 1,
          url: BuildUrl(env.VUE_APP_OUEDKNISS_PORTAL, {
            path: this.$router.resolve({
              name: "announcement_show",
              params: {
                id: v.id,
                slug: v.slug
              }
            }).href
          })
        }))
      };
    },
    page: {
      get() {
        return toInteger(this.filter.page);
      },

      set(v) {
        this.$emit("apply-pagination", v);
      }
    },
    announPerRow() {
      return this.$r({
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4
      });
    },
    displayFrontStore() {
      const propertyNames = Object.keys(this.$route.query);

      if (propertyNames.length === 0) return true;

      if (propertyNames.length === 1 && propertyNames[0] === "lang")
        return true;

      if (propertyNames.length === 1 && propertyNames[0] === "keywords")
        return true;
      if (
        propertyNames.length == 2 &&
        propertyNames[0] === "keywords" &&
        propertyNames[1] === "c"
      )
        return true;
      if (
        propertyNames.length == 2 &&
        propertyNames[0] === "c" &&
        propertyNames[1] === "keywords"
      )
        return true;
      return false;
    },

    items() {
      return [...this.searchStore.data, ...this.search.announcements.data];
    },
    head() {
      return this.searchStore.data.length > 0
        ? this.items.slice(0, this.searchStore.data.length)
        : this.items.slice(0, this.announPerRow);
    },
    rest() {
      return this.searchStore.data.length > 0
        ? this.items.slice(this.searchStore.data.length)
        : this.items.slice(this.announPerRow);
    },
    adsLocation() {
      return this.$isDesktop ? "DESKTOP_LISTING_FEED" : "MOBILE_LISTING_FEED";
    },
    noAdsense() {
      return some(this.search.announcements.data, a => a.noAdsense);
    }
  },
  apollo: {
    promos() {
      return {
        query: PromoFeedListQuery,
        fetchPolicy: "network-only",
        errorPolicy: "ignore",
        variables() {
          return {
            location: this.adsLocation,
            categoryId: this.search.active.category.id,
            withoutAdSense: this.noAdsense
          };
        },
        result({ data }) {
          this.promos = shuffle(data.promos);
          this.firstAd =
            this.promos.length > 0 ? this.promos.slice(0, 1)[0] : null;
        }
      };
    }
  },

  watch: {
    page() {
      if (this.promos.length > 0) {
        const shuffledPromos = shuffle(this.promos);
        this.firstAd = shuffledPromos.slice(0, 1)[0];
      }
    }
  },
  methods: {
    linkGen(page) {
      if (this.$route.name === "search_category") {
        return {
          name: "search_category",
          params: {
            category: this.$route.params.category,
            page:
              page === 1 && this.$route.params.page === undefined
                ? undefined
                : page
          },
          query: this.$route.query
        };
      } else {
        return {
          name: "searchP",
          params: { page: page },
          query: this.$route.query
        };
      }
    },
    applyPagination(page) {
      this.$emit("apply-pagination", page);
      this.$router.push(this.linkGen(page));
    }
  }
};
</script>

<style lang="scss">
.search-view {
  &.--loading {
    opacity: 0.5;
  }

  &__trigger {
    text-align: center;
    position: relative;
    top: -50vh;
  }
}
</style>
