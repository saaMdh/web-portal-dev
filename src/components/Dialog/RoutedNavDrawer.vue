<template>
  <v-navigation-drawer
    v-bind="$attrs"
    :model-value="drawer"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <slot></slot>
  </v-navigation-drawer>
</template>

<script>
import pickBy from "lodash/pickBy";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    drawer: {
      get() {
        return !!this.$route.query[this.id];
      },

      set(v) {
        if (v) {
          this.$router.push({
            query: {
              ...this.$route.query,
              [this.id]: 1
            }
          });
        } else {
          const query = pickBy(this.$route.query, (v, k) => k != this.id);
          this.$router.push({ query });
        }
      }
    }
  },

  watch: {
    modelValue() {
      this.drawer = this.modelValue;
    }
  }
};
</script>

<style lang="scss"></style>
