<template>
  <v-list-item v-if="list.length">
    <template #prepend>
      <v-icon>{{ icon }}</v-icon>
    </template>

    <v-chip
      v-for="item in list"
      :key="item"
      :href="`${scheme}${item}`"
      class="me-1 mb-1"
      >{{ item }}</v-chip
    >
  </v-list-item>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    scheme: {
      type: String,
      default: null
    }
  }
};
</script>

<style>
.v-slide-group__next,
.v-slide-group__prev {
  flex: 0 1 25px;
  min-width: 25px !important;
  max-width: 25px !important;
}
</style>
