<template>
  <vv-field
    ref="field"
    v-slot="{ errors, field }"
    v-model="qty"
    mode="aggressive"
    name="checkoutqty"
    :rules="
      hasManagement ? { required: true, 'checkout.max_qty': maxQuantity } : ''
    "
    min="1"
    type="number"
  >
    <v-text-field
      v-bind="{ ...$attrs, ...field }"
      dense
      variant="outlined"
      :suffix="$t('_.units', modelValue)"
      :label="$t('_.quantity')"
      onkeypress="return event.charCode >= 48"
      :model-value="qty"
      append-icon="mdi-plus"
      prepend-icon="mdi-minus"
      hide-details
      density="compact"
      :error-messages="errors"
      @click.prevent.stop
      @click:prepend="decrement"
      @click:append="increment"
    >
    </v-text-field>
  </vv-field>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    maxQuantity: {
      type: Number,
      required: true
    },
    hasManagement: {
      type: Boolean
    }
  },

  computed: {
    qty: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },
  async mounted() {
    await this.$refs.field.validate();
  },

  methods: {
    increment() {
      this.$emit("update:modelValue", this.modelValue + 1);
    },
    decrement() {
      if (this.modelValue > 1) {
        this.$emit("update:modelValue", this.modelValue - 1);
      }
    }
  }
};
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
