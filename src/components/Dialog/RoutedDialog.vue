<template>
  <v-dialog
    v-bind="$attrs"
    :model-value="active"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <slot></slot>
  </v-dialog>
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
    hasRouteActivator() {
      return !!this.$route.query[this.id];
    },

    active: {
      get() {
        return !!this.$route.query[this.id];
      },

      set(v) {
        if (v) {
          this.$router
            .push({
              query: {
                ...this.$route.query,
                [this.id]: 1
              }
            })
            .catch(() => {});
        } else {
          const query = pickBy(this.$route.query, (v, k) => k != this.id);
          this.$router.push({ query });
        }
      }
    }
  },

  watch: {
    modelValue() {
      this.active = this.modelValue;
    },
    "$route.query": {
      deep: true,
      handler() {
        this.$emit("update:modelValue", this.hasRouteActivator);
      }
    }
  },

  mounted() {
    this.$emit("update:modelValue", this.hasRouteActivator);
  }
};
</script>

<style lang="scss"></style>
