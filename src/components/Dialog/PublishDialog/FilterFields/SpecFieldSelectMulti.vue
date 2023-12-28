<template>
  <vv-field v-slot="{ field, errors }" :rules="required ? 'required' : ''">
    <v-autocomplete
      v-bind="field"
      dense
      filled
      clearable
      multiple
      :label="label"
      :model-value="modelValue"
      item-title="label"
      item-value="codename"
      :error-messages="errors"
      :items="dataset"
      autocomplete="off"
      @change="
        v => {
          $emit('update:modelValue', v);
          selectedDataset = v;
        }
      "
    >
      <template #selection="data">
        <v-chip
          :input-value="data.selected"
          dark
          size="small"
          color="primary"
          class="mt-1"
          @click:close="remove(data.item)"
          >{{ data.item.label }}</v-chip
        >
      </template>
    </v-autocomplete>
  </vv-field>
</template>

<script>
export default {
  props: {
    label: String,
    dataset: Array,
    modelValue: Array,
    required: Boolean
  },
  data() {
    return {
      selectedDataset: null
    };
  },
  methods: {
    remove(item) {
      let index = this.selectedDataset.findIndex(
        element => element == item.codename
      );
      if (index >= 0) this.selectedDataset.splice(index, 1);
      this.$emit("update:modelValue", this.selectedDataset);
    }
  }
};
</script>
