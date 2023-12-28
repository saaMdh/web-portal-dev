<template v-memo="[open]">
  <li
    class="ok-list-group-item"
    :class="{
      'ok-list-clickable': clickable
    }"
  >
    <span class="__prepend">
      <slot name="prepend" v-bind="prependBind"></slot>
    </span>

    <span class="__title">
      <slot name="title" v-bind="titleBind"></slot>
    </span>
    <span class="__append">
      <v-icon v-if="open"> mdi-chevron-up </v-icon>
      <v-icon v-else> mdi-chevron-down </v-icon>
      <slot name="append" v-bind="appendBind"></slot>
    </span>
  </li>
</template>

<script setup>
defineProps({
  subitem: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  },
  prependBind: {
    type: Object,
    default: () => ({})
  },
  titleBind: {
    type: Object,
    default: () => ({})
  },
  appendBind: {
    type: Object,
    default: () => ({})
  }
});
</script>
<style lang="scss">
.ok-list-clickable {
  cursor: pointer;
  &:active {
    background-color: rgba(var(--v-theme-primary), 0.1);
  }
}

.ok-list-group-item {
  display: grid;
  grid-template-areas: "prepend content append";
  grid-template-columns: max-content auto max-content;
  padding: 7px 0px;
  .__prepend {
    display: flex;
    align-items: center;
    margin: 0px 12px;
    justify-content: center;
    &:empty {
      margin: 0px 8px;
    }
    &:not(:empty) {
      min-width: 36px;
    }
  }
  .__title {
    display: flex;
    align-items: center;
  }
  .__append {
    display: flex;
    align-items: center;
    margin: 0px 12px;
    &:empty {
      margin: 0px 6px;
    }
  }
}
</style>
