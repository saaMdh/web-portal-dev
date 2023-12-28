<template>
  <store-query
    ref="store-query"
    :search="search"
    :loading="loading"
    :query-filter="queryFilter"
    :search-keywords="keywords"
    @apply-category="applyCategory"
    @apply-filter="applyFilter"
    @apply-keywords="applyKeywords"
  ></store-query>
</template>

<script>
import StoreQuery from "@/views/SiteBuilder/EditorSheet/QueriesManagement/StoreQuery.vue";
import SearchStoreQuery from "@/views/SiteBuilder/EditorSheet/QueriesManagement/mixins/SearchStoreQuery";

export default {
  components: {
    StoreQuery
  },
  mixins: [SearchStoreQuery]
};
</script>

<style lang="scss"></style>
