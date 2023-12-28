<template>
  <div class="o-data-placeholder text-center" :class="{ '--center': center }">
    <div>
      <div class="__content">
        <v-icon :size="80 * scale" :color="color">{{ icon }}</v-icon>
        <div :class="color + '--text'" :style="{ fontSize: `${30 * scale}px` }">
          <slot></slot>
        </div>
      </div>

      <div class="__action mt-2 px-1">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scale: {
      type: Number,
      default: 1
    },
    icon: {
      type: String,
      default: "mdi-alert-outline"
    },
    color: {
      type: String,
      default: "primary"
    },
    center: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.o-data-placeholder {
  &.--center {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .__content {
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    display: flex;
    opacity: 1;
  }
}
</style>
