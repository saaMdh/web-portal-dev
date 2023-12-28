<template>
  <query
    ref="query"
    :search="search"
    :loading="loading"
    :query-filter="queryFilter"
    :search-keywords="searchKeywords"
    :search-store="searchStore"
    @apply-category="applyCategory"
    @apply-alternative="v => applyAlternative(v.keywords, v.category)"
    @apply-pagination="applyPagination"
    @apply-delivery="applyDelivery"
    @apply-keywords="applyKeywords"
    @apply-filter="applyFilter"
  ></query>
</template>

<script>
import Query from "@/views/SiteBuilder/EditorSheet/QueriesManagement/Query.vue";
import SearchQuery from "@/views/SiteBuilder/EditorSheet/QueriesManagement/mixins/SearchQuery";
import SearchStore from "@/views/SiteBuilder/EditorSheet/QueriesManagement/mixins/SearchStore";

export default {
  components: {
    Query
  },
  mixins: [SearchQuery, SearchStore]
};
</script>

<style lang="scss"></style>
