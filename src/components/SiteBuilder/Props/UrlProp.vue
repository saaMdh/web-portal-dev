<template>
  <v-text-field
    solo
    flat
    hide-details
    clearable
    :model-value="modelValue"
    :label="label && $t(label)"
    @update:modelValue="v => $emit('update:modelValue', v)"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "left"
    },
    label: {
      type: String,
      default: null
    }
  },

  data() {
    return {};
  }
};
</script>

<style></style>
