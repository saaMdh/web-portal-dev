<template>
  <div class="o-dummy">
    <v-img :width="width" :height="height" :src="url" cover>
      <div class="o-dummy__text">
        <slot></slot>
      </div>
    </v-img>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 1300
    },
    height: {
      type: [Number, String],
      default: 600
    }
  },
  computed: {
    url() {
      if (this.$vuetify.theme.current.dark)
        return require("@/assets/empty-dark.svg");
      else return require("@/assets/empty-light.svg");
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-dummy {
  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    font-size: 24px;
    color: black;

    text-align: center;
    line-height: 32px;

    @include isDesktop {
      font-size: 34px;
    }
  }
}
</style>
