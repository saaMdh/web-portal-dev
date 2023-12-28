<template>
  <v-slider
    :model-value="modelValue"
    show-ticks="always"
    thumb-color="primary"
    :step="1"
    :min="0"
    :max="100"
    :label="label"
    @update:modelValue="v => $emit('update:modelValue', v)"
  ></v-slider>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: null
    }
  }
};
</script>

<style></style>
