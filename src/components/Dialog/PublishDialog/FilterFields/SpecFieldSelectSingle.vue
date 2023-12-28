<template>
  <div>
    <vv-field v-slot="{ field, errors }" :rules="required ? 'required' : ''">
      <v-autocomplete
        v-bind="field"
        dense
        filled
        clearable
        :label="label"
        :model-value="val"
        item-title="label"
        item-value="codename"
        :items="dataset"
        :error-messages="errors"
        autocomplete="off"
        @update:model-value="v => setValue(v)"
      >
      </v-autocomplete>
    </vv-field>
    <vv-field
      v-if="val == 'other'"
      v-slot="{ field, errors }"
      :rules="required ? 'required' : ''"
    >
      <v-text-field
        v-bind="field"
        class="ms-1"
        :model-value="modelValue"
        filled
        dense
        :label="label"
        :error-messages="errors"
        clearable
        @update:model-value="v => $emit('update:modelValue', v)"
      ></v-text-field>
    </vv-field>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    dataset: Array,
    modelValue: [String, Number, Object],
    required: Boolean,
    codename: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      val: this.modelValue
    };
  },

  methods: {
    setValue(v) {
      this.val = v;
      if (v != "other") this.$emit("update:modelValue", v);
    }
  }
};
</script>
