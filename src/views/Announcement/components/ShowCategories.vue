<template>
  <div class="o-show-categories">
    <v-breadcrumbs
      v-if="loading > 0"
      :items="[1, 2]"
      class="px-0 py-0 mx-n1"
      density="compact"
    >
      <template #divider>
        <v-icon
          :icon="$vuetify.locale.rtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
          size="small"
        ></v-icon>
      </template>
      <template #title="{ item }">
        <ok-text-loader :key="item" :width="115"></ok-text-loader>
      </template>
    </v-breadcrumbs>
    <template v-else>
      <json-ld v-if="jsonld" :jsonld="jsonld" type="breadcrumb"></json-ld>
      <v-breadcrumbs
        :items="_categories"
        class="px-0 py-0 mx-n1 d-block"
        density="compact"
        :disabled="false"
      >
        <template #divider>
          <v-icon
            :icon="
              $vuetify.locale.rtl ? 'mdi-chevron-left' : 'mdi-chevron-right'
            "
            class="mt-1"
            size="small"
          ></v-icon>
        </template>
        <template #title="{ item }">
          <router-link :to="to(item)" @click="toBuilder(item)">
            <v-btn
              :aria-label="item.name"
              class="pa-0 text-capitalize"
              variant="text"
              color="secondary"
              height="20"
              density="compact"
            >
              {{ item.name }}
            </v-btn>
          </router-link>
        </template>
      </v-breadcrumbs>
    </template>
  </div>
</template>

<script>
import sortBy from "lodash/sortBy";
import jsonLd from "@/components/jsonLd.vue";
import okTextLoader from "@/components/uiKit/loader/okTextLoader";
import BuildUrl from "build-url";
import env from "@/utils/env.js";
import { isStorePath } from "@/utils/location";
export default {
  components: { jsonLd, okTextLoader },
  props: {
    categories: {
      type: Array
    },
    loading: {
      type: Number
    }
  },
  computed: {
    jsonld() {
      if (!this._categories) return null;
      var elements = [];

      for (let i = 0; i < 3; i++) {
        if (this._categories[i]) {
          elements[i] = {
            position: i + 1,
            name: this._categories[i].name,
            item: BuildUrl(env.VUE_APP_OUEDKNISS_PORTAL, {
              path: this.$router.resolve({
                name: "search_category",
                params: { category: this._categories[i].slug, page: 1 }
              }).href
            })
          };
        }
      }
      return {
        itemListElement: elements
      };
    },
    _categories() {
      return sortBy(this.categories, c => parseInt(c.id)).map(c => ({
        slug: c.slug,
        name: c.name,
        disabled: false
      }));
    }
  },
  methods: {
    to(item) {
      if (this.isPortal)
        return {
          name: "search_category",
          params: { category: item.slug, page: 1 }
        };

      return {};
    },
    toBuilder(item) {
      if (!this.isPortal)
        this.$router.push({
          name: `${
            isStorePath(this.$route) ? "store" : "land"
          }-announcement-search`,
          query: { category: item.slug, page: 1 }
        });
    }
  }
};
</script>
<style lang="scss">
.o-show-categories {
  .v-breadcrumbs-divider {
    padding: 0;
  }
  .v-btn {
    min-width: 10px;
  }
}
</style>
