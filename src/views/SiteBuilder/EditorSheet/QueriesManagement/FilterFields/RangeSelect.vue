<template>
  <div>
    <v-select
      v-if="dataset.length <= 10"
      :items="dataset"
      item-title="label"
      item-value="codename"
      :model-value="modelValue"
      hide-details
      solo
      flat
      clearable
      autocomplete="off"
      :label="label"
      @change="v => $emit('update:modelValue', v)"
    >
      <template #selection="data">
        <v-chip
          :input-value="data.selected"
          close
          dark
          size="small"
          color="amber"
          @click:close="remove(data.item)"
          >{{ data.item.label }}
        </v-chip>
      </template>
    </v-select>

    <v-autocomplete
      v-else
      :items="dataset"
      item-title="label"
      item-value="codename"
      :model-value="modelValue"
      hide-details
      solo
      flat
      clearable
      autocomplete="off"
      :label="label"
      @change="v => $emit('update:modelValue', v)"
    >
    </v-autocomplete>
  </div>
</template>

<script>
import without from "lodash/without";

export default {
  props: {
    label: String,
    dataset: Array,
    modelValue: [String, Number],
    codename: {
      type: String,
      default: null
    }
  },

  methods: {
    remove(item) {
      const newValue = without(this.modelValue, item.id);
      this.$emit("update:modelValue", newValue);
    }
  }
};
</script>
