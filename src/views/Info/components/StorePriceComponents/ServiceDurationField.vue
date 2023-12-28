<template>
  <v-text-field
    v-model.number="duration"
    :label="$t('purchase.serviceDuration.label')"
    variant="outlined"
    min="1"
    placeholder="0"
    type="number"
    :error-messages="errors"
    :suffix="$t('purchase.serviceDuration.durationTypes.' + durationType)"
    :dense="dense"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    modelValue: { type: [Number, String], default: 1 },
    durationType: { type: String, default: "MONTH" },
    errors: { type: Array, default: null },
    dense: { type: Boolean, default: false }
  },
  data() {
    return {};
  },

  computed: {
    duration: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  }
};
</script>
