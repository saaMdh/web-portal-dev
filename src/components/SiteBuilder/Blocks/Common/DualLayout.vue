<template>
  <div
    class="s-dual-layout"
    :class="{
      '--reverse': reverse,
      '--first-only': firstOnly
    }"
  >
    <div>
      <slot name="first"></slot>
    </div>

    <div v-if="!firstOnly">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reverse: {
      type: Boolean,
      default: false
    },
    firstOnly: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";

.s-dual-layout {
  display: flex;
  width: 100%;

  flex-direction: row;
  gap: 12px;

  align-items: center;
  justify-content: space-around;

  &.--reverse {
    flex-direction: row-reverse;
  }

  @include isDesktop {
    > div {
      width: 50%;
    }

    &.--first-only {
      > div {
        width: 100%;
      }
    }
  }

  @include isMobile {
    flex-direction: column;

    &.--reverse {
      flex-direction: column;
    }

    > div {
      width: 100%;
    }
  }
}
</style>
