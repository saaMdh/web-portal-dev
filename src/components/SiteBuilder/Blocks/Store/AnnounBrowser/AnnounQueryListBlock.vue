<template>
  <div class="pa-3">
    <text-editor
      v-if="config.caption"
      v-model="config.name"
      class="mb-2"
      @update:modelValue="update"
    >
      <h3 class="font-weight-bold text-decoration-none">
        {{ config.name ? config.name[$i18n.locale] : "" }}
      </h3>
    </text-editor>

    <v-row dense>
      <v-col cols="12" md="12">
        <template v-if="loading && firstLoading">
          <v-row dense>
            <v-col
              v-for="item in 8"
              :key="item"
              :cols="$isMobile ? 12 : 3"
              :sm="$isMobile ? 6 : null"
            >
              <ok-card-loader
                :target="
                  $isMobile
                    ? 'MobileAnnouncementStore'
                    : 'DesktopAnnouncementStore'
                "
              ></ok-card-loader>
            </v-col>
          </v-row>
        </template>

        <template v-else-if="items.data && items.data.length">
          <v-row dense>
            <v-col
              v-for="(item, index) in showItems"
              :key="`${item.id}-${index}`"
              :cols="$isMobile ? 12 : 3"
              :sm="$isMobile && !$store.state.builder.editor.phone ? 6 : null"
            >
              <announcement-card
                :announcement="item"
                :store-page="true"
                :dark="config.theme === 'dark'"
              ></announcement-card>
            </v-col>
          </v-row>
        </template>
        <template
          v-else-if="!config.value || !config.value.sourceValue.length > 0"
        >
          <v-alert type="info" icon="mdi-magnify">
            {{ $t("components.announBrowser.noAnnouncements") }}
          </v-alert>
        </template>
      </v-col>
    </v-row>
    <template v-if="loading && !firstLoading">
      <v-row class="py-4">
        <v-spacer></v-spacer>
        <v-progress-circular indeterminate></v-progress-circular>
        <v-spacer></v-spacer>
      </v-row>
    </template>
    <div class="d-flex justify-center">
      <v-btn
        v-if="!showAll && items.data && items.data.length > 8"
        :aria-label="$t('home.feed.showMore')"
        depressed
        size="small"
        class="mt-4"
        color="primary"
        variant="text"
        @click="showAll = !showAll"
      >
        {{ $t("home.feed.showMore") }}
        <v-icon end :class="{ 'mt-n1': !$vuetify.locale.rtl }"
          >mdi-chevron-down</v-icon
        >
      </v-btn>
      <div
        v-else-if="
          config.value &&
          config.value.source === 'query' &&
          !loading &&
          items.data &&
          items.paginatorInfo &&
          items.paginatorInfo.lastPage &&
          pagination.page < items.paginatorInfo.lastPage
        "
        v-intersect.quite="intersect"
      ></div>
    </div>
  </div>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import AnnounSourcePropVue from "@/components/SiteBuilder/Props/AnnounSourceProp.vue";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
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
    TextEditor,
    AnnouncementCard
  },
  mixins: [BlocksHelperMixin, QueryMixin],
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  editableProps: [
    {
      key: "caption",
      icon: "mdi-text-box",
      label: "components.announquerylistBlock.addTitle",
      field: BooleanPropVue
    },
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
        count: 24
      },
      loading: 0,
      firstLoading: true
    };
  },
  computed: {
    ...mapGetters({ store: "builder/store" }),
    query() {
      if (!isEmpty(this.queries)) return this.joinQuery(this.queries);
      else return null;
    },
    showItems() {
      return !this.showAll ? this.items.data.slice(0, 8) : this.items.data;
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
      await sleep(300);
      this.loading = 0;
      this.firstLoading = false;
      return {
        data: get(data, "search.announcements.data", []),
        paginatorInfo: get(data, "search.announcements.paginatorInfo", {
          lastPage: null
        })
      };
    },
    slugify: id => id.trim().split(" ").join("-"),
    intersect(_e, _o, isInteresecting) {
      if (!isInteresecting) return;
      if (this.loading > 0) return;
      this.pagination.page++;
      this.fetchAnnouncementByQuery();
    }
  }
};
</script>
