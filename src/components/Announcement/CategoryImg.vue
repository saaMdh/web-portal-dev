<template>
  <v-img
    v-bind="$attrs"
    :src="mediaUrl"
    contain
    :lazy-src="require('@/assets/logomark-h.svg')"
  >
    <slot></slot>
  </v-img>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      default: null
    }
  },

  computed: {
    mediaUrl() {
      if (this.category.icon) return this.category.icon;
      else return require("@/assets/logomark-h.svg");
    }
  }
};
</script>

<style></style>
