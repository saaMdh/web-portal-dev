<template>
  <v-dialog v-model="active" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="transparent" elevation="3">
        <v-toolbar-title>
          {{ $t("topbar.search.submit") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn :aria-label="$t('topbar.search.submit')" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form class="pa-4" @submit.prevent="makeSearch">
        <div class="mb-4">{{ $t("topbar.search.label") }} :</div>
        <v-text-field
          ref="searchField"
          v-model="query"
          class="searchField"
          :label="$t('topbar.search.input')"
          variant="outlined"
          hide-details
          hide-no-data
          clearable
          rounded
          append-inner-icon="mdi-magnify"
          style="border-color: primary"
          :search-input="query"
          @update:search-input="v => (query = v)"
          @click:append="makeSearch"
          @keyup.enter="makeSearch"
        >
          <!-- Recent Searchs section -->
        </v-text-field>
        <category-select-field
          v-model="categorySlug"
          class="my-3"
          rounded
          return-slug
          all
          variant="solo-filled"
          color="primary"
          :label="$t('search.allCategories')"
          :menu-props="{ offsetY: true, closeOnContentClick: true }"
          @change="searchFocus"
          @blur="searchFocus"
        ></category-select-field>
        <v-btn
          :aria-label="$t('topbar.search.submit')"
          block
          rounded
          variant="elevated"
          color="primary"
          @click.stop="makeSearch"
        >
          <v-icon> mdi-magnify </v-icon>
          {{ $t("topbar.search.submit") }}
        </v-btn>
        <template
          v-if="shortenedRecentSearches && shortenedRecentSearches.length"
        >
          <v-list-subheader class="pt-5 px-2">
            {{ $t("topbar.search.recent") }}</v-list-subheader
          >

          <v-chip
            v-for="(term, index) in shortenedRecentSearches"
            :key="index"
            class="ma-1 px-0"
          >
            <v-btn
              :aria-label="term.text"
              variant="text"
              class="pe-1"
              style="min-width: 10px"
              @click="
                () => {
                  query = term.text;
                  makeSearch();
                }
              "
              >{{ term.text }}</v-btn
            >
            <v-btn
              :aria-label="$t('_.close')"
              icon
              color="transparent"
              size="x-small"
              @click="
                () => {
                  recentSearches = recentSearches.filter(
                    el => el.text !== term.text
                  );
                }
              "
              ><v-icon size="x-large">mdi-close-circle</v-icon></v-btn
            ></v-chip
          >
        </template>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import SearchState from "@/views/Search/SearchState";
import assign from "lodash/assign";
import isEmpty from "lodash/isEmpty";

import { QUERY_DEFAULT_GLOBAL_SEARCH } from "@/schema/search";
import useSearchHistory from "@/composables/useSearchHistory";
import CategorySelectField from "@/components/Field/CategorySelectField.vue";
export default {
  components: {
    CategorySelectField
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const {
      logSearch,
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    } = useSearchHistory();
    return {
      logSearch,
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    };
  },

  data() {
    return {
      itemActive: true,
      query: "",
      active: false,
      categorySlug: 0
    };
  },

  computed: {
    modelSearch() {
      return this.$store.state.dialog.modelSearch;
    }
  },
  watch: {
    modelSearch(value) {
      if (value) this.open();
    }
  },
  methods: {
    searchFocus() {
      this.$refs.searchField.focus();
    },
    async makeSearch() {
      if (isEmpty(this.query) && isEmpty(this.categorySlug)) return;
      if (
        isEmpty(this.query) &&
        isEmpty(this.categorySlug) &&
        this.itemActive
      ) {
        this.categorySlug = null;
        return;
      }
      this.close();
      assign(SearchState, QUERY_DEFAULT_GLOBAL_SEARCH);

      SearchState.keywords = this.query;
      SearchState.categorySlug = this.categorySlug;
      SearchState.page = 1;
      SearchState.fetchActiveCategory = true;

      this.logSearch(this.query);

      this.$router.push({
        name: "search",
        params: { page: 1 },
        query: {
          keywords: this.query ? this.query.slugify() : undefined,
          c: this.categorySlug ? this.categorySlug : undefined
        }
      });
    },

    open() {
      this.active = true;
      this.query = this.$route.query.keywords
        ? this.$route.query.keywords.unslugify()
        : "";
      if (this.$route.name === "home") {
        this.categorySlug = 0;
      } else {
        this.categorySlug = this.categorySlug ? this.categorySlug : 0;
      }
      setTimeout(() => this.$refs.searchField.focus(), 400);
    },
    close() {
      this.active = false;
      this.$store.commit("dialog/closeDialog", { name: "modelSearch" });
    }
  }
};
</script>
<style>
.searchField.v-select--is-menu-active .v-input__icon--append .v-icon {
  transform: none;
}
</style>
