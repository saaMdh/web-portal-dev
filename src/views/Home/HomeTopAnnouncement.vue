<template>
  <lazy min-height="325" unrender :backend-loading="loading > 0">
    <template #skeleton>
      <v-row dense class="my-0 mx-n1">
        <v-col
          v-for="i in $r({
            lg: 6,
            md: 4,
            sm: 3,
            xs: 2
          })"
          :key="i"
          lg="2"
          md="3"
          sm="4"
          cols="6"
        >
          <ok-card-loader :target="'AnnouncementMini'"></ok-card-loader>
        </v-col>
      </v-row>
    </template>
    <template #default>
      <pixel-img
        v-if="pixelUuid && topAdsList && topAdsList.length > 0"
        :key="pixelKey"
        payload-type="promotion_view"
        :promotions="promotionIds"
        :lazy="false"
      ></pixel-img>
      <swiper
        :key="topAdListKey"
        v-slot="{ item }"
        :items="topAdsList"
        :slides-per-view="
          $r({
            xs: 2.1,
            sm: 3.1,
            md: 5.1,
            lg: 6.1
          })
        "
        :space-between="0"
        class="mx-n1"
        :navigation="$isDesktop"
        fill-height
      >
        <announcement-card
          :key="topAdListKey"
          class="ma-1"
          :announcement="item.target"
          hide-details
          mini
          @click="recordPromotion(item.id)"
        ></announcement-card>
        <pixel-img
          v-if="pixelUuid && topAdsList && topAdsList.length > 0 && item.target"
          :key="item.target.id"
          payload-type="announcement_appear"
          :announcement="item.target"
          :lazy="true"
        ></pixel-img>
      </swiper>
    </template>
  </lazy>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import gql from "graphql-tag";
import { PROMOTION_MINI_CONTENT } from "@/components/Announcement/fragement.js";
import { defineAsyncComponent } from "vue";
import pixelImg from "@/components/Announcement/pixelImg.vue";

const PROMO_TOP_ANNOUN_QUERY = gql`
  ${PROMOTION_MINI_CONTENT}
  query PromoTopAnnounQuery(
    $location: PromotionLocation!
    $count: Int
    $mediaSize: MediaSize = SMALL
    $hideStore: Boolean = false
  ) {
    topAdList: promotionFetch(location: $location, maxCount: $count) {
      id
      target {
        ... on PromotionAnnouncement {
          ...PromotionMiniContent
        }
      }
    }
  }
`;

export default {
  components: {
    pixelImg,
    okCardLoader,
    AnnouncementCard: defineAsyncComponent(() =>
      import("@/components/Announcement/AnnouncementCard")
    ),
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },

  data() {
    return {
      topAdsList: [],
      loading: 0,
      topAdListKey: 0,
      pixelUuid: Math.random().toString()
    };
  },
  computed: {
    pixelKey() {
      return this.pixelUuid + JSON.stringify(this.topAdsList.map(i => i.id));
    },
    promotionIds() {
      return this.topAdsList.map(i => i.id);
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
  methods: {
    recordPromotion(id) {
      this.$stats.recordPromotion(location.href, id);
    }
  },
  apollo: {
    topAdList() {
      return {
        loadingKey: "loading",
        query: PROMO_TOP_ANNOUN_QUERY,
        fetchPolicy: "no-cache",
        variables() {
          return { location: "CROSS_HOME_TOP_AD", count: 12 * 4 };
        },
        result({ data }) {
          if (data === undefined) return;

          let list = data.topAdList.filter(item => item.target !== null);
          let shuffled = list
            .map(value => ({
              value,
              score: Math.random()
            }))
            .sort((a, b) => a.score - b.score)
            .map(({ value }) => value);
          this.topAdsList = shuffled.map(e => {
            if (e.target) e.target.status = "PUBLISHED";
            return e;
          });

          this.topAdListKey++;
        }
      };
    }
  }
};
</script>
