import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";
import AnnounSourcePropVue from "@/components/SiteBuilder/Props/AnnounSourceProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import QueryMixin from "@/components/SiteBuilder/Blocks/Market/QueryMixin";

import Queries from "@/components/SiteBuilder/Blocks/Market/AnnounQuery/AnnounQuery.graphql";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
export default {
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
  mixins: [BlocksHelperMixin, QueryMixin],
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
      isEmpty: true,
      items: null,
      loading: 0
    };
  },
  computed: {
    query() {
      if (!isEmpty(this.queries)) return this.joinQuery(this.queries);
      else return null;
    },
    showItems() {
      return !this.showAll ? this.items.slice(0, 8) : this.items;
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
        filter: { count: 24, page: 1, announcementIds: this.adsIds }
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
        query: Queries.AnnouncementBrowser,
        fetchPolicy: "network-only",
        loadingKey: "loading",
        variables
      });
      return get(data, "search.announcements.data", []);
    },
    slugify: id =>
      id
        .trim()
        .split(" ")
        .join("-")
  }
};
