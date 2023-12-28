<template>
  <v-slider
    :model-value="modelValue"
    :ticks="labels"
    show-ticks="always"
    thumb-color="primary"
    :step="1"
    :min="min"
    :max="max"
    @update:modelValue="v => $emit('update:modelValue', v)"
  ></v-slider>
</template>

<script>
import times from "lodash/times";
export default {
  props: {
    modelValue: {
      type: Number,
      default: 5
    },
    label: {
      type: String,
      default: null
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 9
    }
  },

  data() {
    return {
      labels: times(9 + 1, i => `${i}`)
    };
  }
};
</script>

<style></style>
