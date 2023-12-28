<template>
  <lazy
    v-if="loading > 0 || stores.length > 0"
    min-height="350"
    unrender
    :backend-loading="stores.length === 0"
  >
    <template #skeleton>
      <v-row no-gutters>
        <v-col
          v-for="i in $r({
            lg: 4,
            md: 3,
            sm: 3,
            xs: 1
          })"
          :key="i"
          lg="3"
          md="4"
          sm="4"
          cols="12"
        >
          <ok-card-loader margin="5px" :target="'Store'"></ok-card-loader>
        </v-col>
      </v-row>
    </template>
    <template #default>
      <store-card-full
        v-if="stores.length === 1 && isSmallMobile"
        :store="stores[0].target"
        :record-promo="stores[0].id"
        class="mb-1"
      ></store-card-full>
      <swiper
        v-else
        v-slot="{ item }"
        :items="stores"
        :space-between="2"
        class="mx-n1"
        :slides-per-view="
          $r({
            xs: 1.1,
            sm: 2.1,
            md: 3.1,
            lg: 4.1
          })
        "
        :navigation="$isDesktop"
      >
        <div class="pa-1">
          <store-card-full
            :store="item.target"
            :record-promo="item.id"
          ></store-card-full>
        </div>
      </swiper>
    </template>
  </lazy>
</template>

<script>
import StoreCardFull from "@/components/Store/StoreCardFull.vue";

import { PromoSquareQuery } from "../Search.graphql";
import shuffle from "lodash/shuffle";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    ),
    StoreCardFull,
    okCardLoader
  },

  props: {
    categoryId: {
      type: [Number, String],
      default: null
    },
    ignore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      squarePromo: [],
      loading: 0
    };
  },
  computed: {
    stores() {
      return this.squarePromo.filter(
        s => !!s.target && s.target.__typename === "Store"
      );
    },
    isSmallMobile() {
      return this.$r({
        xs: true,
        sm: false,
        md: false
      });
    }
  },
  methods: {
    min(...args) {
      return Math.min(args);
    }
  },
  apollo: {
    squarePromo: {
      loadingKey: "loading",
      query: PromoSquareQuery,
      fetchPolicy: "network-only",
      skip() {
        return this.ignore;
      },
      variables() {
        return {
          location: "CROSS_LISTING_FRONT_STORE",
          categoryId: this.categoryId
        };
      },
      result({ data }) {
        this.squarePromo = shuffle(data.squarePromo);
      }
    }
  }
};
</script>