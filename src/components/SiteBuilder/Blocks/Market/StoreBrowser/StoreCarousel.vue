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
    <v-container fluid class="s-store-carousel">
      <swiper
        v-slot="{ item }"
        :items="loading ? [1, 2, 3, 4, 5, 6] : stores"
        :navigation="!$isMobile"
        :slides-per-view="$r({ xs: 1.2, sm: 2.2, md: 4.1 })"
        fill-height
      >
        <ok-card-loader v-if="loading" :target="'Store'"></ok-card-loader>
        <v-container v-else class="store-carousel-container">
          <v-card dense :elevation="1">
            <store-card-full
              :store="item"
              class="store-browser-card"
            ></store-card-full
          ></v-card>
        </v-container>
      </swiper>
      <template v-if="!loading && stores.length === 0">
        <v-alert type="info">
          {{ $t("search.notFound.0") }}
        </v-alert>
      </template>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */

import StoreCardFull from "@/components/Store/StoreCardFull.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import okCardLoader from "@/components/uiKit/loader/okCardLoader";
import truncate from "lodash/truncate";
import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import StoreBrowser from "./StoreBrowserQuery.graphql";
import StoreSourcePropVue from "@/components/SiteBuilder/Props/StoreSourceProp";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { defineAsyncComponent } from "vue";

import { groupeItems } from "@/utils/array";
import env from "@/utils/env";
export default {
  components: {
    okCardLoader,
    StoreCardFull,
    TextEditor,
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
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
            if (this.query.filter?.count > 20) this.query.filter.count = 20;
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
.s-store-carousel {
  &__wrapper {
    display: flex;
    flex-direction: row;
  }
  padding: 0px !important;
}

.store-carousel-container {
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-top: 0px !important;
}
.v-theme--dark .__body {
  background: #fff !important;
}
</style>
