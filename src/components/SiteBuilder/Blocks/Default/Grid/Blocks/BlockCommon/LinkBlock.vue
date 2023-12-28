<template>
  <router-link v-if="isPath" class="href" :to="to">
    <slot></slot>
  </router-link>
  <a v-else :href="to" class="href" target="_blank">
    <slot></slot>
  </a>
</template>

<script>
import { sync } from "vuex-pathify";
export default {
  components: {},

  props: {
    link: { type: String, default: null }
  },

  computed: {
    ...sync({
      editorEnable: "builder/editor@enable"
    }),
    to() {
      return !this.editorEnable ? this.link : this.isPath ? "" : null;
    },
    isPath() {
      return this.link ? this.link.startsWith("/") : false;
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";
.href {
  display: flex;
  justify-content: center;
  text-decoration: none;
}
</style>
