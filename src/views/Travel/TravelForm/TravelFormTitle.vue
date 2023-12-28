<template>
  <h1 class="travel-form-title pt-4 px-3 d-flex align-center">
    <slot name="avatar">
      <v-avatar size="30" tile>
        <v-icon size="30" :color="color">{{ icon }}</v-icon>
      </v-avatar>
    </slot>
    <div class="mx-4">
      <slot></slot>
    </div>
  </h1>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null
    },

    color: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.travel-form-title {
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1;

  @include isDesktop {
    font-size: 1.4rem;
  }
}
</style>
