<template>
  <div class="pagination" :class="{ pagination_mobile: $isMobile }">
    <v-pagination
      v-bind="$attrs"
      :total-visible="$isMobile ? 1 : 6"
      active-color="primary"
      variant="elevated"
      elevation="1"
      :size="size"
    >
    </v-pagination>
  </div>
</template>
<script>
export default { props: { size: { type: String, default: "small" } } };
</script>
<style lang="scss">
.pagination .v-btn {
  font-size: 0.9em;
}
.pagination_mobile .v-pagination__next .v-btn {
  width: 120px;
}
html:lang(fr) .pagination_mobile .v-pagination__next .v-btn__content:before {
  content: "Suivant";
}
html:lang(en) .pagination_mobile .v-pagination__next .v-btn__content:before {
  content: "Next";
}
html:lang(ar) .pagination_mobile .v-pagination__next .v-btn__content:before {
  content: "التالي";
}
.pagination_mobile .v-pagination__prev .v-btn {
  width: 120px;
}
html:lang(fr) .pagination_mobile .v-pagination__prev .v-btn__content:after {
  content: "Précédent";
}
html:lang(en) .pagination_mobile .v-pagination__prev .v-btn__content:after {
  content: "Previous";
}
html:lang(ar) .pagination_mobile .v-pagination__prev .v-btn__content:after {
  content: "السابق";
}
</style>
