<template>
  <div class="o-search-nf">
    <div class="text-center">
      <h1 class="text-h2 text-primary">(⌐■_■)</h1>
      <h2 class="text-h5 mt-4 text-primary">{{ $t("search.notFound.0") }}</h2>
      <h2 class="text-body-1">{{ $t("search.notFound.1") }}</h2>
      <h2 class="text-body-1">{{ $t("search.notFound.2") }}</h2>

      <v-form class="mt-8" @submit.prevent="makeSearch">
        <v-text-field
          v-model="q"
          variant="solo"
          rounded
          single-line
          density="compact"
          hide-details
          append-inner-icon="mdi-magnify"
          :label="$t('_.search')"
          @click:append-inner="makeSearch"
        ></v-text-field>
      </v-form>
    </div>
  </div>
</template>

<script>
import useSearchHistory from "@/composables/useSearchHistory";
export default {
  props: {
    modelValue: {
      type: String,
      default: null
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
      q: (this.modelValue || "").unslugify()
    };
  },
  methods: {
    makeSearch() {
      if (!this.q || this.q.length <= 0) return;
      const keyword = this.q.slugify();
      this.logSearch(this.q);
      // FIXME: the @submit handler push to router also, redundunt navigation
      this.$router.push({
        name: "search",
        params: { page: 1 },
        query: { keywords: keyword }
      });

      this.$emit("submit", keyword);
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-search-nf {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 4px * 4;
  height: calc(100vh - 64px);

  h3 {
    font-size: 2vw;
  }
}
</style>
