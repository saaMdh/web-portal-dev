<template>
  <lazy min-height="282" unrender :backend-loading="isLoading">
    <template #skeleton>
      <v-row dense class="pt-1 mx-n1">
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
        v-slot="{ item }"
        :items="topAdsList"
        :slides-per-view="
          $r({
            xs: 2.1,
            sm: 3.1,
            md: 5.1,
            lg: cover ? 5.1 : 6.1
          })
        "
        :space-between="0"
        class="mx-n1"
        :navigation="$isDesktop"
        fill-height
      >
        <announcement-card
          class="ma-1"
          :announcement="item.target"
          hide-details
          mini
          @click="recordPromotion(item.id)"
        ></announcement-card>
      </swiper>
    </template>
  </lazy>
</template>

<script>
import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

import { TopAnnounQuery } from "../Search.graphql";
const PAGINATION_COUNT = 30;
import env from "@/utils/env.js";
import { defineAsyncComponent } from "vue";
import pixelImg from "@/components/Announcement/pixelImg.vue";

export default {
  components: {
    pixelImg,
    AnnouncementCard,
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    ),
    okCardLoader
  },

  props: {
    category: {
      type: Object,
      default: () => ({ required: false, id: null, slug: null })
    },
    cover: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      topAdsList: null,
      loading: 0,
      pixelUuid: Math.random().toString()
    };
  },
  computed: {
    pixelKey() {
      return this.pixelUuid + JSON.stringify(this.topAdsList.map(i => i.id));
    },
    isLoading() {
      return (
        (!this.category.required || this.category.slug || this.category.id) &&
        this.loading
      );
    },
    promotionIds() {
      return this.topAdsList.map(i => i.id);
    }
  },
  watch: {
    "category.slug": {
      handler(_new, _old) {
        const new_slug = (_new || "").split("-")[0],
          old_slug = (_old || "").split("-")[0];
        if (new_slug === old_slug) return;
        this.fetchTopAnnounList();
      },
      immediate: true
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
    async fetchTopAnnounList() {
      this.loading = true;
      if (this.category.required && !this.category.id && !this.category.slug)
        return;
      try {
        const { data } = await this.$apollo.query({
          query: TopAnnounQuery,
          fetchPolicy: "no-cache",
          variables: {
            location: "CROSS_LISTING_TOP_AD",
            count: PAGINATION_COUNT,
            categoryId: this.category.id,
            categorySlug: this.category.slug
          }
        });
        let list = data.topAnnounList.filter(item => item.target !== null);
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
        this.loading = false;
      } catch (error) {
        if (env.isDev) console.error(error);
        this.loading = false;
      }
    },
    recordPromotion(id) {
      let context = {};
      if (this.$route.query.c) context.category = this.$route.query.c;
      if (this.$route.query.keywords)
        context.keywords = this.$route.query.keywords;
      this.$stats.recordPromotion(location.href, id, context);
    }
  }
};
</script>
