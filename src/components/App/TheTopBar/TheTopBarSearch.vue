<template>
  <vv-form v-slot="{ handleSubmit }">
    <v-form class="ok-search-field" @submit.prevent="handleSubmit(submit)">
      <vv-field
        v-slot="{ field, errors }"
        v-model="search.q"
        name="searchField"
        rules="required"
      >
        <v-text-field
          v-bind="field"
          ref="search"
          autocomplete="off"
          :model-value="search.q"
          class="search-bar-ok"
          :placeholder="$t('topbar.search.input')"
          variant="solo-filled"
          :color="errors.length > 0 ? 'primary' : 'error'"
          rounded
          density="compact"
          flat
          hide-details
          @click:append="handleSubmit(submit)"
          @click.stop.prevent="menuActive = true"
        >
          <template #append-inner>
            <v-btn
              :aria-label="$t('_.search')"
              rounded="xl"
              density="comfortable"
              style="min-width: 50px; width: 50px"
              :variant="menuActive ? 'elevated' : 'text'"
              :color="menuActive && errors.length > 0 ? 'error' : 'primary'"
              @click="handleSubmit(submit)"
            >
              <v-icon size="x-large"> mdi-magnify </v-icon>
            </v-btn>
          </template>
          <v-menu
            v-model="menuActive"
            activator="parent"
            absolute
            offset="10"
            transition="slide-y-transition"
            location="bottom center"
            :min-width="menu.width"
            :close-on-content-click="false"
            @click="menuActive && $refs.search.focus()"
          >
            <v-card
              variant="elevated"
              elevation="3"
              class="ok-search-menu"
              :width="menu.width"
            >
              <template
                v-if="shortenedRecentSearches && shortenedRecentSearches.length"
              >
                <v-card-text class="pb-0">
                  {{ $t("topbar.search.recent") }}
                  <v-chip-group column>
                    <v-chip
                      v-for="term in shortenedRecentSearches"
                      :key="term.text"
                      size="small"
                      variant="tonal"
                      closable
                      @click="handleSubmit(submit({ recentSearch: term.text }))"
                      @click:close="
                        recentSearches = recentSearches.filter(
                          el => el.text !== term.text
                        )
                      "
                    >
                      {{ term.text }}</v-chip
                    >
                  </v-chip-group>
                </v-card-text>
              </template>
              <v-card-text>
                {{ $t("topbar.search.title") }}

                <v-chip-group
                  v-model="search.category"
                  column
                  selected-class="text-primary"
                >
                  <v-chip
                    v-for="item in $store.getters.categories"
                    :key="item.target.slug"
                    :value="item.target.slug"
                    filter
                    class="search-chip"
                  >
                    <v-avatar start>
                      <category-img
                        style="width: 25px; height: 25px"
                        :category="item"
                      />
                    </v-avatar>
                    {{ item.name }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  :aria-label="$t('topbar.search.close')"
                  variant="text"
                  @click="closeMenu"
                >
                  <v-icon start>mdi-close</v-icon>
                  {{ $t("topbar.search.close") }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :aria-label="$t('topbar.search.submit')"
                  color="primary"
                  variant="text"
                  @click="handleSubmit(submit)"
                >
                  <v-icon class="me-1">mdi-magnify</v-icon>
                  {{ $t("topbar.search.submit") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-text-field>
      </vv-field>
    </v-form>
  </vv-form>
</template>

<script>
import SearchState from "@/views/Search/SearchState";
import assign from "lodash/assign";
import isEmpty from "lodash/isEmpty";
import { QUERY_DEFAULT_GLOBAL_SEARCH } from "@/schema/search";

import useSearchHistory from "@/composables/useSearchHistory";
export default {
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
      menuActive: false,
      menu: {
        x: 0,
        y: 65,
        width: 600
      },
      search: {
        q: "",
        category: null,
        page: 1
      }
    };
  },

  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler() {
        this.menuActive = false;
        if (this.$route.name === "search" || this.$route.name === "searchP") {
          this.search.q = !isEmpty(this.$route.query.keywords)
            ? this.$route.query.keywords.unslugify()
            : null;
        } else {
          this.search.q = "";
        }
      }
    },

    menuActive(v) {
      if (!v) this.search.category = null;
    }
  },

  mounted() {
    if (this.$vuetify.locale.rtl)
      this.menu.x =
        window.innerWidth - (window.innerWidth - this.menu.width) / 2;
    else this.menu.x = (window.innerWidth - this.menu.width) / 2;
  },

  methods: {
    async submit({ searchField, recentSearch }) {
      this.closeMenu();
      const keyword = searchField || recentSearch;
      if (keyword) this.search.q = keyword.unslugify();
      assign(SearchState, QUERY_DEFAULT_GLOBAL_SEARCH);
      const searchKeyword = this.search.q.slugify();
      SearchState.keywords = searchKeyword;
      SearchState.categorySlug = this.search.category;
      SearchState.page = 1;
      SearchState.fetchActiveCategory = true;

      this.logSearch(keyword.slugify());

      this.$router.push({
        name: "searchP",
        params: { page: 1 },
        query: {
          keywords: searchKeyword,
          c: this.search.category || undefined
        }
      });
    },
    closeMenu() {
      this.menuActive = false;
      this.$refs.search.blur();
    }
  }
};
</script>

<style lang="scss">
.search-bar-ok {
  width: 500px;
}
@media (max-width: 1200px) {
  .search-bar-ok {
    width: 300px;
  }
}
.search-chip {
  line-height: 2;
  letter-spacing: -0.5px;
}

.search-bar-ok .v-field {
  background: rgba(0, 0, 0, 0.03);
}
</style>
