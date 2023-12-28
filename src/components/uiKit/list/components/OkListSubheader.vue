<template v-once>
  <span
    class="ok-list-subheader"
    :class="{
      'ok-list-subheader-inset': inset
    }"
  >
    <slot></slot>
  </span>
</template>

<script setup>
defineProps({
  inset: {
    type: Boolean,
    default: false
  }
});
</script>
<style lang="scss">
.ok-list-subheader {
  align-items: center;
  background: inherit;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  display: flex;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  -webkit-padding-end: 16px;
  padding-inline-end: 16px;
  min-height: 40px;
}

.ok-list-subheader-inset {
  padding: 0px 0px 0px 10px;
}

html[dir="rtl"] {
  .ok-list-subheader-inset {
    padding: 0px 10px 0px 0px;
  }
}
</style>
