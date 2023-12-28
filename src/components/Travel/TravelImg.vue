<template>
  <v-img
    v-bind="$attrs"
    :src="mediaUrl"
    contain
    :lazy-src="require('@/assets/default-travel.png')"
    @error="src = null"
  >
    <slot></slot>
  </v-img>
</template>

<script>
import get from "lodash/get";

export default {
  props: {
    destination: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      src: get(this.destination, "imageUrl", "")
    };
  },

  computed: {
    mediaUrl() {
      return this.src ? this.src : require("@/assets/default-travel.png");
    }
  }
};
</script>

<style></style>
