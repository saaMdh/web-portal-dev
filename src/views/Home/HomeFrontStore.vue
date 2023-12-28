<template>
  <section-heading
    icon="mdi-store"
    icon-color="primary"
    :show-more="{ name: 'boutiques' }"
  >
    <template #title>
      {{ $t("home.frontStore.title") }}
    </template>
  </section-heading>
  <lazy min-height="360" unrender :backend-loading="!storeList.length">
    <template #skeleton>
      <v-row dense class="py-1">
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
          <ok-card-loader :target="'Store'"></ok-card-loader>
        </v-col>
      </v-row>
    </template>
    <template #default>
      <swiper
        v-if="storeList"
        v-slot="{ item }"
        :items="storeList"
        :slides-per-view="
          $r({
            xs: 1.1,
            sm: 2.1,
            md: 3.1,
            lg: 4.1
          })
        "
        :navigation="$isDesktop"
        :space-between="0"
        class="mx-n1"
      >
        <store-card-full
          class="ma-1"
          :store="item.target"
          :record-promo="item.id"
        ></store-card-full>
      </swiper>
      <pixel-img
        v-if="pixelUuid && storeList && storeList.length > 0"
        :key="pixelKey"
        payload-type="promotion_view"
        :promotions="promotionIds"
        :lazy="false"
      ></pixel-img>
    </template>
  </lazy>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import SectionHeading from "@/components/Content/SectionHeading.vue";
import StoreCardFull from "@/components/Store/StoreCardFull.vue";
import pixelImg from "@/components/Announcement/pixelImg.vue";

import gql from "graphql-tag";

import { STORE_CARD_FULL_CONTENT } from "@/components/Store/fragement";
import { defineAsyncComponent } from "vue";

const FRONT_STORE_QUERY = gql`
  ${STORE_CARD_FULL_CONTENT}
  query FrontStoreQuery($location: PromotionLocation!, $count: Int) {
    storeList: promotionFetch(location: $location, maxCount: $count) {
      id
      target {
        ... on Store {
          ...StoreCardFullContent
        }
      }
    }
  }
`;

export default {
  components: {
    pixelImg,
    okCardLoader,
    StoreCardFull,
    SectionHeading,
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },

  data() {
    return {
      storeList: [],
      loading: 0,
      pixelUuid: Math.random().toString()
    };
  },
  computed: {
    pixelKey() {
      return this.pixelUuid + JSON.stringify(this.storeList.map(s => s.id));
    },
    promotionIds() {
      return this.storeList.map(i => i.id);
    }
  },
  activated() {
    if (!this.pixelUuid) {
      this.pixelUuid = Math.random().toString();
    }
  },
  deactivated() {
    this.pixelUuid = null;
  },
  apollo: {
    storeList() {
      return {
        loadingKey: "loading",
        query: FRONT_STORE_QUERY,
        fetchPolicy: "network-only",
        variables() {
          return { location: "CROSS_HOME_FRONT_STORE", count: 16 };
        },
        result({ data }) {
          if (data === undefined) return;
          this.storeList = data.storeList
            .map(value => ({
              value,
              score: Math.random()
            }))
            .sort((a, b) => a.score - b.score)
            .map(({ value }) => value);
        }
      };
    }
  }
};
</script>
