<template v-once>
  <li
    class="ok-list-item"
    :class="{
      'ok-list-clickable': clickable,
      'ok-list-subitem': subitem,
      'ok-list-inset': inset
    }"
  >
    <span class="__prepend" v-bind="prependBind">
      <slot name="prepend"></slot>
    </span>
    <span class="__title" v-bind="titleBind">
      <slot name="title"></slot>
    </span>
    <span class="__append" v-bind="appendBind">
      <slot name="append"></slot>
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
    default: true
  },
  inset: {
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

.ok-list-item {
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

.ok-list-subitem {
  padding: 7px 12px 7px 12px;
  font-size: 0.9em;
}
.ok-list-inset {
  padding: 10px 0px 10px 45px;
}

html[dir="rtl"] {
  .ok-list-inset {
    padding: 10px 45px 10px 0px;
  }
}
</style>
