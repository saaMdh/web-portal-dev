<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="modelValue"
    hide-details
    prepend-inner-icon="mdi-magnify"
    clearable
    variant="solo"
    density="comfortable"
    @update:model-value="submit"
    @click:clear="$emit('update:modelValue', '')"
    @keyup.enter="$emit('makeSearch')"
  >
    <template #append-inner>
      <slot></slot>
    </template>
  </v-text-field>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  methods: {
    submit: debounce(function (v) {
      console.log(v);
      this.$emit("update:modelValue", v);
    }, 1000)
  }
};
</script>
