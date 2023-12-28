<template>
  <div>
    <div class="page-top">
      <v-container>
        <h1 class="mt-2">
          <template v-if="selectedTags">{{ selectedTags.name }}</template>
          <template v-else>
            {{ $t("home.stores.title") }}
          </template>
        </h1>
        <v-row dense class="mt-2">
          <v-col cols="12" md="8">
            <v-text-field
              :model-value="filter.q"
              variant="solo-filled"
              density="compact"
              hide-details
              clearable
              append-inner-icon="mdi-magnify"
              :label="$t('_.search')"
              @update:model-value="v => makeSearch(v)"
            ></v-text-field
          ></v-col>
          <v-col cols="12" md="4">
            <store-tags-select-field
              :model-value="filter.storeTags"
              @update:modelValue="updateTag"
              @select="v => (selectedTags = v)"
            ></store-tags-select-field>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container class="pt-0">
      <div v-if="loading" class="d-flex justify-center align-center">
        <v-row class="mt-3" dense>
          <v-col
            v-for="i in [...Array(8).keys()]"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ok-card-loader :target="'Store'"></ok-card-loader>
          </v-col>
        </v-row>
      </div>
      <template v-else-if="groups.length > 0">
        <!--  eslint-disable vue/attribute-hyphenation -->
        <v-infinite-scroll
          style="
            height: 100%;
            width: 100%;
            overflow: hidden;
            padding-left: 1px;
            padding-right: 1px;
          "
          :items="groups"
          :onLoad="fetchMore"
          color="primary"
        >
          <v-row v-for="(group, index) in groups" :key="index" dense>
            <v-col
              v-for="item in group"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <lazy
                min-height="340"
                unrender
                :unrender-delay="5000"
                :root-margin="'100px'"
              >
                <template #skeleton>
                  <ok-card-loader :target="'Store'"></ok-card-loader>
                </template>
                <template #default>
                  <store-card-full :store="item"></store-card-full>
                </template>
              </lazy>
            </v-col>
          </v-row>
          <template #empty> </template>
        </v-infinite-scroll>
      </template>
      <template v-else-if="notFound && !loading">
        <v-alert
          class="mt-3"
          color="primary"
          :icon="$isDesktop ? 'mdi-magnify' : null"
          variant="tonal"
          prominent
        >
          <div class="text-h5">{{ $t("search.notFound.0") }}</div>

          <div class="mt-2">
            {{ $t("search.notFound.1") }}<br />{{ $t("search.notFound.2")
            }}<br />{{ $t("search.notFound.3") }}
          </div>
        </v-alert>
      </template>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
import { VInfiniteScroll } from "vuetify/labs/VInfiniteScroll";

import StoreTagsSelectField from "./component/StoreTagsSelectField.vue";

import StoreCardFull from "@/components/Store/StoreCardFull.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import truncate from "lodash/truncate";

import Queries from "./Store.graphql";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import { groupeItems } from "@/utils/array";
import env from "@/utils/env";

export default {
  name: "Store",

  components: {
    VInfiniteScroll,
    okCardLoader,
    StoreCardFull,
    StoreTagsSelectField
  },

  data() {
    return {
      loading: 0,
      notFound: false,
      selectedTags: null,

      pagination: {
        page: 1,
        count: 12
      },

      stores: [],

      filter: {
        storeTags: null,
        q: !isEmpty(this.$route.query.keyword) ? this.$route.query.keyword : ""
      }
    };
  },

  head() {
    const keywords = document.querySelector('meta[name="keywords"]');
    keywords?.setAttribute("content", this.$t("meta.store.keywords"));

    return {
      meta: [
        {
          name: "keywords",
          content: this.$t("meta.store.keywords")
        },
        {
          property: "og:title",
          content: this.$t("meta.store.keywords")
        },
        {
          property: "og:site_name",
          content: "Ouedkniss.com"
        },
        {
          property: "og:description",
          content: truncate(this.$t("home.meta.description"), 200)
        },
        {
          property: "og:url",
          content: location.href
        }
      ]
    };
  },
  activated() {
    this.setQuery(this.$route);
    this.injectCbRouteWatcher(route => {
      this.setQuery(route);
    });
  },
  deactivated() {
    this.clearCbRouteWatcher();
  },
  computed: {
    groups() {
      if (this.stores.length > 0)
        return groupeItems(
          this.stores,
          this.$r({
            cols: 1,
            sm: 2,
            md: 3,
            lg: 4
          })
        );
      return [];
    }
  },
  watch: {
    filter: {
      deep: true,
      async handler() {
        this.$router.push({
          name: "boutiques",
          params: {
            tag: !isEmpty(this.filter.storeTags)
              ? this.filter.storeTags.code
              : undefined
          },
          query: {
            keyword: !isEmpty(this.filter.q)
              ? this.filter.q.slugify()
              : undefined
          }
        });
        this.pagination.page = 1;
        this.stores = await this.fetchStore();
      }
    }
  },
  async created() {
    this.stores = await this.fetchStore();
  },

  methods: {
    setQuery(route) {
      const code = get(this.$route.params, "tag", null);
      const q = get(this.$route.query, "keyword", "");
      this.filter.storeTags = code ? { code } : null;
      this.filter.q = q.unslugify();
    },
    updateTag(tags) {
      this.filter.storeTags = tags;
    },
    makeSearch: debounce(function (v) {
      this.filter.q = v;
    }, 1000),
    async fetchStore(disableLoading = false) {
      if (!disableLoading) this.loading = 1;
      try {
        const { data } = await this.$apollo.query({
          query: Queries.SearchStore,
          fetchPolicy: "no-cache",
          variables: {
            q: this.filter.q,
            filter: {
              storeTags: this.filter.storeTags
                ? this.filter.storeTags.code
                : null,
              count: this.pagination.count,
              page: this.pagination.page
            }
          }
        });
        this.notFound = get(data, "stores.data.length", 0) === 0;
        const stores = get(data, "stores.data", []);
        this.loading = 0;
        return stores;
      } catch (error) {
        this.loading = 0;
        if (env.isDev) console.error(error);
        this.notFound = true;
        return [];
      }
    },
    async fetchMore({ done }) {
      //TODO Virtualized infinite scroller
      this.pagination.page++;
      const newStore = await this.fetchStore(true);
      if (newStore.length > 0) done("ok");
      else done("empty");
      this.stores.push(...newStore);
    }
  }
};
</script>

<style lang="scss">
.v-theme--light {
  .page-top {
    background: #eee;
  }
  h1 {
    color: #444;
  }
}
h1 {
  font-weight: 400;
  word-wrap: normal;
  font-size: 1.5rem;
}
.v-theme--dark {
  .page-top {
    background: #191919;
  }
  h1 {
    color: #aaa;
  }
}
</style>
