<template v-memo="[open, loading]">
  <ul class="ok-list-group">
    <slot :open="open"></slot>
    <template v-if="open">
      <div class="d-flex justify-center align-center">
        <slot v-if="loading" name="loading"></slot>
      </div>
      <ok-list>
        <slot v-if="!loading" name="list"></slot>
      </ok-list>
    </template>
  </ul>
</template>

<script setup>
import OkList from "./OkList.vue";
defineProps({
  open: {
    type: Boolean,
    default: false
  },
  loading: {
    type: [Boolean, Number],
    default: false
  }
});
</script>
<style lang="scss">
.ok-list-group {
  list-style: none;
}
</style>
