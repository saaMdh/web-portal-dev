<template>
  <div v-if="suggested.length > 0">
    <suggested-deep-breadcrumb-field
      :loading="loading"
      :items="suggested"
      @update:modelValue="
        v => $emit('submit', { category: v.category.slug, keywords: modelValue })
      "
    >
    </suggested-deep-breadcrumb-field>
  </div>
</template>

<script>
import take from "lodash/take";
import SuggestedDeepBreadcrumbField from "@/components/Field/SuggestedDeepBreadcrumbField.vue";

export default {
  components: { SuggestedDeepBreadcrumbField },
  props: {
    modelValue: {
      type: String,
      default: null
    },
    search: {
      type: Object,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    suggested() {
      return [this.search.active, ...take(this.search.suggested, 10)];
    }
  }
};
</script>

<style></style>
