<template>
  <v-select
    v-if="storeTagsList"
    v-model="selected"
    :items="storeTagsList"
    clearable
    hide-details
    item-title="name"
    item-value="code"
    :label="$t('search.filter.storeTags')"
    variant="solo-filled"
    return-object
    density="compact"
    :menu-props="{ contentClass: 'tags-select-menu' }"
  >
  </v-select>
  <v-select
    v-else
    :label="$t('search.filter.storeTags')"
    density="compact"
    variant="solo-filled"
    hide-details
  ></v-select>
</template>

<script>
import gql from "graphql-tag";

export default {
  props: {
    modelValue: {
      type: [Object, String, Number],
      default: null
    }
  },
  emits: ["select", "updateSlug"],

  computed: {
    selected: {
      get() {
        if (this.modelValue == 0) return null;
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
        this.$emit("select", v);
      }
    }
  },
  apollo: {
    storeTagsList: {
      loadingKey: "loading",
      query: gql`
        query ($q: String, $count: Int, $page: Int) {
          storeTagsList(q: $q, count: $count, page: $page) {
            id
            name
            code
          }
        }
      `
    }
  }
};
</script>
<style lang="scss">
@import "@/scss/responsive";
@include isMobile {
  .tags-select-menu {
    left: 12px !important;
    right: 12px !important;
  }
}
</style>
