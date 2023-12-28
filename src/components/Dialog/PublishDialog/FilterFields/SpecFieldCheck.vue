<template>
  <vv-field v-slot="{ field, errors }" :rules="required ? 'required' : ''">
    <v-checkbox
      v-bind="field"
      :error-messages="errors"
      :label="label"
      :model-value="modelValue"
      @change="v => $emit('update:modelValue', v)"
    ></v-checkbox>
  </vv-field>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: Boolean,
    required: Boolean
  }
};
</script>
