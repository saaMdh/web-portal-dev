<template>
  <div style="padding: 1px">
    <v-row dense>
      <v-col cols="12" md="12">
        <template v-if="loading && firstLoading">
          <v-row dense>
            <v-col v-for="item in count" :key="item" :cols="cols">
              <ok-card-loader :target="'AnnouncementMini'"></ok-card-loader>
            </v-col>
          </v-row>
        </template>

        <template v-else-if="items.data && items.data.length">
          <v-row dense>
            <v-col
              v-for="(item, index) in showItems"
              :key="`${item.id}-${index}`"
              :cols="cols"
            >
              <announcement-card
                :announcement="item"
                :dark="config.theme === 'dark'"
                mini
                hide-store
                hide-official
              ></announcement-card>
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <v-alert type="info" icon="mdi-magnify">
            {{ $t("components.announBrowser.noAnnouncements") }}
          </v-alert>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";

import AnnounSourcePropVue from "@/components/SiteBuilder/Props/AnnounSourceProp.vue";

import BlockHelperMixinGrid from "@/components/SiteBuilder/Blocks/Default/Grid/BlockHelperMixinGrid";

import QueryMixin from "@/components/SiteBuilder/Blocks/Market/QueryMixin";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import Queries from "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserQuery.graphql";

import { mapGetters } from "vuex";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import sleep from "@/utils/Sleep";

export default {
  components: {
    okCardLoader,
    AnnouncementCard
  },
  mixins: [BlockHelperMixinGrid, QueryMixin],
  props: { width: null },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
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
      showAll: false,
      config: {
        value: null,
        caption: true,
        name: { fr: "Le titre", ar: "العنوان الرئيسي", en: "The title" }
      },

      adsIds: [],
      queries: null,
      items: { data: [], paginatorInfo: { lastPage: null } },
      pagination: {
        page: 1,
        count: 6
      },
      loading: 0
    };
  },
  computed: {
    ...mapGetters({ store: "builder/store" }),
    query() {
      if (!isEmpty(this.queries)) return this.joinQuery(this.queries);
      else return null;
    },
    count() {
      return this.width <= 700
        ? this.width <= 500
          ? this.width <= 300
            ? 1
            : 4
          : 6
        : 4;
    },
    showItems() {
      return this.items.data.slice(0, this.count);
    },
    cols() {
      return this.width <= 700
        ? this.width <= 500
          ? this.width <= 300
            ? 12
            : 6
          : 4
        : 3;
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
        this.firstLoading = true;
        this.items = { data: [], paginatorInfo: { lastPage: null } };
        this.fetchAnnouncementByQuery();
      }
    },
    adsIds: {
      deep: true,
      immediate: true,
      handler() {
        this.firstLoading = true;
        this.items = { data: [], paginatorInfo: { lastPage: null } };
        this.fetchAnnouncementByAdsIds();
      }
    }
  },
  methods: {
    async fetchAnnouncementByAdsIds() {
      if (isEmpty(this.adsIds)) return;
      const variables = {
        filter: {
          count: this.adsIds.length,
          page: 1,
          announcementIds: this.adsIds
        }
      };
      const { data } = await this.fetchAnnouncement(variables);
      this.items.data = data;
    },
    fetchAnnouncementByQuery() {
      if (isEmpty(this.query)) return;
      if (isEmpty(this.query.cluster)) return;
      const vm = this;
      this.query.cluster.forEach(async c => {
        const variables = {
          q: c.q,
          filter: {
            page: this.pagination.page,
            count: this.pagination.count,
            storeId: this.store.id,
            ...c.filter
          }
        };
        const { data, paginatorInfo } = await this.fetchAnnouncement(variables);
        vm.items.data.push(...data);
        vm.items.paginatorInfo = paginatorInfo;
        vm.items.data = [
          ...new Map(this.items.data.map(item => [item["id"], item])).values()
        ];
      });
    },
    async fetchAnnouncement(variables) {
      this.loading = 1;
      const { data } = await this.$apollo.query({
        query: Queries.AnnouncementBrowser,
        fetchPolicy: "network-only",
        loadingKey: "loading",
        variables
      });
      await sleep(3000);
      this.loading = 0;
      this.firstLoading = false;
      return {
        data: get(data, "search.announcements.data", []),
        paginatorInfo: get(data, "search.announcements.paginatorInfo", {
          lastPage: null
        })
      };
    }
  }
};
</script>
