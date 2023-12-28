<template>
  <v-switch
    :input-value="modelValue"
    :model-value="modelValue"
    :label="label && $t(label)"
    @update:modelValue="v => $emit('update:modelValue', v)"
  ></v-switch>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    }
  }
};
</script>

<style></style>
