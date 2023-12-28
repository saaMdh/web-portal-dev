<template>
  <v-autocomplete
    :model-value="modelValue"
    :items="regions"
    :label="$t('travel.agencies.form.targetRegion')"
    item-title="name"
    item-value="id"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
  >
  </v-autocomplete>
</template>

<script>
import gql from "graphql-tag";
export default {
  props: {
    modelValue: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    return {
      regions: []
    };
  },

  apollo: {
    regions: {
      query: gql`
        {
          regions: regionList {
            id
            slug
            name
          }
        }
      `
    }
  }
};
</script>

<style></style>
