<template>
  <div>
    <editor-categories-list
      ref="editor-categories-list"
      v-model="$props.queryFilter.categorySlug"
      class="mx-2"
      @submit="v => applyCategoryWithFilters(v)"
    ></editor-categories-list>
    <v-card color="transparent" :loading="loading > 0">
      <search-form
        :search="search"
        :model-value="searchKeywords"
        class="px-2 pt-3"
        @update:modelValue="
          kw => applyKeywordsWithoutFilters(kw, suggested.length > 0)
        "
      ></search-form>
      <search-filters
        :category="queryFilter.category"
        :filter="$props.queryFilter"
        @submit="v => applyFilterWithoutCategory(v)"
      ></search-filters>
    </v-card>
  </div>
</template>

<script>
import EditorCategoriesList from "@/views/SiteBuilder/EditorSheet/QueriesManagement/EditorCategoriesList.vue";
import SearchFilters from "@/views/SiteBuilder/EditorSheet/QueriesManagement/SearchFilters.vue";
import SearchForm from "@/views/SiteBuilder/EditorSheet/QueriesManagement/SearchForm.vue";

import isEmpty from "lodash/isEmpty";
import some from "lodash/some";
import take from "lodash/take";
import get from "lodash/get";

export default {
  components: {
    EditorCategoriesList,
    SearchFilters,
    SearchForm
  },

  props: {
    search: {
      type: Object,
      required: true
    },
    searchStore: {
      type: Object,
      required: true
    },
    queryFilter: {
      type: Object,
      required: true
    },
    searchKeywords: {
      type: String,
      default: null
    },
    loading: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      openfilter: false
    };
  },
  computed: {
    suggested() {
      return take(this.search.suggested, 3);
    },
    noAdsense() {
      return some(this.search.announcements.data, a => a.noAdsense);
    },
    displayTopAnnoun() {
      const propertyNames = Object.keys(this.$route.query);

      if (propertyNames.length === 0) return true;

      return false;
    }
  },
  methods: {
    isEmpty(v) {
      return isEmpty(v);
    },
    applyFilterWithoutCategory(filter) {
      filter.fetchActiveCategory = false;
      this.$emit(
        "apply-filter",
        filter,
        this.search.active?.category?.slug || null
      );
    },

    applyKeywordsWithoutFilters(kw, hasSuggested) {
      this.$props.queryFilter.fetchActiveCategory = false;
      this.$props.queryFilter.keywords = null;

      if (this.$props.queryFilter.categorySlug === null)
        this.$props.queryFilter.fetchActiveCategory = true;

      this.$emit(
        "apply-keywords",
        kw,
        !hasSuggested ? get(this.search, "active.category.slug") : null
      );
    },

    applyCategoryWithFilters(category) {
      this.$props.queryFilter.fetchActiveCategory = true;
      this.$emit("apply-category", category);
    }
  }
};
</script>
