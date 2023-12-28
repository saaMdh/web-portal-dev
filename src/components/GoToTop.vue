<template>
  <v-fab-transition>
    <v-btn
      v-if="visible"
      v-bind="$attrs"
      :aria-label="$t('_.gotoTop')"
      class="o-gototop"
      fab
      :color="color"
      bottom
      end
      fixed
      @click="goTo(0)"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  props: {
    threshold: { type: Number, default: 400 },
    color: { type: String, default: "primary" }
  },

  data() {
    return {
      visible: false
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scroll);
  },
  methods: {
    scroll() {
      this.visible = window.pageYOffset > this.threshold;
    }
  }
};
</script>

<style>
.o-gototop {
  bottom: 64px !important;
}
</style>
