<template>
  <div>
    <editor-categories-list
      ref="editor-categories-list"
      v-model="$props.queryFilter.categorySlug"
      type="STORES"
      class="mx-2 mt-3"
      @submit="v => applyCategoryWithFilters(v)"
    ></editor-categories-list>
    <v-card color="transparent" :loading="loading > 0">
      <search-form
        :search="search"
        :model-value="$props.searchKeywords"
        class="mx-2 mt-3"
        @update:modelValue="kw => applyKeywordsWithoutFilters(kw)"
      ></search-form>
      <store-search-filters
        v-if="!isEmpty(queryFilter.categorySlug)"
        :category="category"
        :filter="$props.queryFilter"
        @submit="v => applyFilterWithoutCategory(v)"
      ></store-search-filters>
    </v-card>
  </div>
</template>

<script>
import EditorCategoriesList from "@/views/SiteBuilder/EditorSheet/QueriesManagement/EditorCategoriesList.vue";
import StoreSearchFilters from "@/views/SiteBuilder/EditorSheet/QueriesManagement/StoreSearchFilters.vue";
import SearchForm from "@/views/SiteBuilder/EditorSheet/QueriesManagement/SearchForm.vue";

import isEmpty from "lodash/isEmpty";

export default {
  components: {
    EditorCategoriesList,
    StoreSearchFilters,
    SearchForm
  },

  props: {
    search: {
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
      openfilter: false,
      category: {}
    };
  },
  methods: {
    isEmpty(v) {
      return isEmpty(v);
    },
    applyFilterWithoutCategory(filter) {
      this.$emit("apply-filter", filter, this.queryFilter.categorySlug);
    },

    applyKeywordsWithoutFilters(kw) {
      this.$emit("apply-keywords", kw);
    },

    applyCategoryWithFilters(category) {
      this.category = category;
      this.$emit("apply-category", category);
    }
  }
};
</script>
