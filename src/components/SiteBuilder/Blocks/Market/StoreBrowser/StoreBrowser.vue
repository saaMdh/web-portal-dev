<template>
  <div class="pa-3">
    <text-editor
      v-if="config.caption"
      v-model="config.name"
      class="mb-4"
      @update:modelValue="update"
    >
      <h1 class="font-weight-bold s-store-browser-block-title">
        {{ config.name ? config.name[$i18n.locale] : "" }}
      </h1>
    </text-editor>
    <v-container class="py-0">
      <div v-if="loading" class="d-flex justify-center align-center">
        <v-row class="mt-1" density="compact">
          <v-col
            v-for="i in [...Array(8).keys()]"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ok-card-loader :target="'Store'" class="ma-1"></ok-card-loader>
          </v-col>
        </v-row>
      </div>
      <template v-else-if="groups.length > 0">
        <v-infinite-scroll
          style="height: 100%; width: 100%; overflow: hidden"
          class="px-1"
          mode="manual"
          :items="groups"
          :load-more-text="$t('components.storeBrowserBlock.loadMore')"
          @load="fetchMore"
        >
          <v-row v-for="(group, index) in groups" :key="index">
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
                  <ok-card-loader
                    :target="'Store'"
                    class="ma-1"
                  ></ok-card-loader>
                </template>
                <template #default>
                  <v-card :elevation="2">
                    <store-card-full
                      :store="item"
                      class="store-browser-card"
                    ></store-card-full>
                  </v-card>
                </template>
              </lazy>
            </v-col>
          </v-row>
          <template #empty>
            <v-alert
              class="mt-3"
              color="primary"
              :icon="$isDesktop ? 'mdi-magnify' : ''"
              variant="text"
              prominent
            >
              <div class="text-h5">{{ $t("search.notFound.0") }}</div>
            </v-alert>
          </template>
        </v-infinite-scroll>
      </template>
      <template v-else-if="notFound && !loading">
        <v-alert
          class="mt-3"
          color="primary"
          :icon="$isDesktop ? 'mdi-magnify' : ''"
          variant="text"
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

import StoreCardFull from "@/components/Store/StoreCardFull.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";
import { VInfiniteScroll } from "vuetify/labs/VInfiniteScroll";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import truncate from "lodash/truncate";
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import StoreBrowser from "./StoreBrowserQuery.graphql";
import StoreSourcePropVue from "@/components/SiteBuilder/Props/StoreSourceProp";

import QueryPropVue from "@/components/SiteBuilder/Props/QueryProp";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";

import { groupeItems } from "@/utils/array";
import env from "@/utils/env";
export default {
  components: {
    VInfiniteScroll,
    okCardLoader,
    StoreCardFull,
    TextEditor
  },
  mixins: [BlocksHelperMixin],
  editableProps: [
    {
      key: "caption",
      icon: "mdi-text-box",
      label: "components.storeBrowserBlock.addTitle",
      field: BooleanPropVue
    },
    {
      key: "value",
      icon: "mdi-star-box-outline",
      label: "components.storeBrowserBlock.filter",
      field: StoreSourcePropVue,
      bind: {
        queryType: "STORES",
        multiple: false
      }
    }
  ],

  data() {
    return {
      config: {
        value: null,
        caption: true,
        name: { fr: "Le titre", ar: "العنوان الرئيسي", en: "The title" }
      },
      loading: 0,
      notFound: false,
      query: null,
      pagination: {
        page: 1
      },
      stores: [],
      q: "",
      defaultQuery: {
        filter: {
          count: 8
        }
      }
    };
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
    "config.value": {
      deep: true,
      immediate: true,
      async handler(v) {
        {
          if (v !== null && v.sourceValue !== null) {
            this.query = v.sourceValue;
          } else {
            this.query = cloneDeep(this.defaultQuery);
          }
          this.stores = await this.fetchStore();
        }
      }
    },
    filter: {
      deep: true,
      async handler() {
        this.pagination.page = 1;
        this.stores = await this.fetchStore();
      }
    },
    async q() {
      this.pagination.page = 1;
      this.stores = await this.fetchStore();
    }
  },
  async created() {
    this.stores = await this.fetchStore();
  },

  methods: {
    makeSearch: debounce(function (v) {
      this.q = v;
    }, 1000),
    async fetchStore(more = 0) {
      if (!more) this.loading = 1;
      try {
        const { data } = await this.$apollo.query({
          query: StoreBrowser,
          fetchPolicy: "no-cache",
          variables: {
            q: this.query.q || "",
            filter: {
              categorySlug: this.query.filter?.categorySlug || null,
              regionId: this.query.filter?.regionId || null,
              cityId: this.query.filter?.cityId || null,
              hasDelivery: this.query.filter?.hasDelivery || null,
              storeIds: this.query.filter?.storeIds || null,
              count: this.query.count,
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
      this.pagination.page++;
      const newStore = await this.fetchStore(1);
      if (newStore.length > 0) done("ok");
      else done("empty");
      this.stores.push(...newStore);
    }
  }
};
</script>

<style lang="scss">
h1 {
  font-weight: 400;
  word-wrap: normal;
  font-size: 1.5rem;
}
.s-store-browser-block-title {
  text-decoration: underline;
  text-underline-offset: 8px;
  text-decoration-color: rgb(var(--v-theme-primary));
}
.v-theme--dark .__body {
  background: #fff !important;
}
</style>
