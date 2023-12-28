<template>
  <v-autocomplete
    v-bind="$attrs"
    :model-value="modelValue"
    :items="relayPoints.data"
    item-title="name"
    item-value="id"
    :label="$t('checkout.info.relayPoint')"
    @update:model-value="v => $emit('update:modelValue', v)"
  ></v-autocomplete>
</template>

<script>
import gql from "graphql-tag";

export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    }
  },
  emits: ["input"],

  data() {
    return {
      relayPoints: { data: [] }
    };
  },

  apollo: {
    relayPoints: {
      // TODO: deliveryRelayPointList should handle search by keywords
      query: gql`
        query {
          relayPoints: deliveryRelayPointList(count: 10, page: 1) {
            data {
              id
              name
            }
          }
        }
      `
    }
  }
};
</script>

<style></style>
