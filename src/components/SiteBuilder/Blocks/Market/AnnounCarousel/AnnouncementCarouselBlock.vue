<template>
  <v-container fluid class="s-annon-block">
    <swiper
      v-slot="{ item }"
      :items="loading ? [1, 2, 3, 4, 5, 6] : items"
      :navigation="!$isMobile"
      :slides-per-view="phoneMode ? 1.2 : $r({ xs: 1.2, sm: 2.2, md: 4.1 })"
      fill-height
    >
      <ok-card-loader
        v-if="loading"
        :target="
          $isMobile
            ? 'MobileCarouselAnnouncementStore'
            : 'DesktopCarouselAnnouncementStore'
        "
      ></ok-card-loader>

      <announcement-card
        v-else
        :announcement="item"
        :large="config.large"
        :store-page="true"
        :dark="config.theme === 'dark'"
        hide-details
      ></announcement-card>
    </swiper>

    <template v-if="!loading && items.length === 0">
      <v-alert type="info">
        {{ $t("components.announBrowser.noAnnouncements") }}
      </v-alert>
    </template>
  </v-container>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";

import AnnounSourcePropVue from "@/components/SiteBuilder/Props/AnnounSourceProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import QueryMixin from "@/components/SiteBuilder/Blocks/Market/QueryMixin";

import Queries from "@/components/SiteBuilder/Blocks/Market/AnnounCarousel/AnnounQuery.graphql";
import { mapGetters } from "vuex";

import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    okCardLoader,
    AnnouncementCard,
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },
  mixins: [BlocksHelperMixin, QueryMixin],

  editableProps: [
    {
      key: "value",
      icon: "mdi-star-box-outline",
      label: "components.announcementCarouselBlock.announs",
      field: AnnounSourcePropVue
    }
  ],

  data() {
    return {
      items: [],
      config: {
        count: 8,
        large: false,
        value: null,
        items: null
      },
      adsIds: [],
      queries: null,
      loading: 0
    };
  },

  computed: {
    ...mapGetters({ phoneMode: "builder/phoneMode" }),
    query() {
      if (!isEmpty(this.queries)) return this.joinQuery(this.queries);
      else return null;
    }
  },
  watch: {
    "config.value": {
      deep: true,
      immediate: true,
      handler(v) {
        if (v && v.source === "query") {
          this.queries = v.sourceValue;
        } else if (v && v.source === "announce") {
          this.adsIds = v.sourceValue;
        }
      }
    },
    query: {
      deep: true,
      immediate: true,
      handler() {
        this.items = [];
        this.fetchAnnouncementByQuery();
      }
    },
    adsIds: {
      deep: true,
      immediate: true,
      handler() {
        this.items = [];
        this.fetchAnnouncementByAdsIds();
      }
    }
  },
  methods: {
    async fetchAnnouncementByAdsIds() {
      if (isEmpty(this.adsIds)) return;
      const variables = {
        count: 10,
        page: 1,
        filter: { announcementIds: this.adsIds }
      };
      this.items = await this.fetchAnnouncement(variables);
    },
    fetchAnnouncementByQuery() {
      if (isEmpty(this.query)) return;
      if (isEmpty(this.query.cluster)) return;
      const vm = this;
      this.query.cluster.forEach(async c => {
        const variables = {
          q: c.q,
          filter: {
            page: 1,
            count: c.count,
            ...c.filter
          }
        };
        const data = await this.fetchAnnouncement(variables);
        vm.items.push(...data);
        vm.items = [
          ...new Map(this.items.map(item => [item["id"], item])).values()
        ];
      });
    },
    async fetchAnnouncement(variables) {
      const { data } = await this.$apollo.query({
        query: Queries.AnnouncementQuery,
        loadingKey: "loading",
        variables
      });
      return get(data, "search.announcements.data", []);
    },
    slugify: id => id.trim().split(" ").join("-")
  }
};
</script>

<style lang="scss">
.s-annon-block {
  &__wrapper {
    display: flex;
    flex-direction: row;

    > div {
      padding: 0 8px;
    }
  }
}
</style>
