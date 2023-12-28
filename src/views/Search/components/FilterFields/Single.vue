<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-select
    v-if="dataset.length <= 20"
    ref="select"
    v-bind="$attrs"
    :items="dataset"
    item-title="label"
    item-value="codename"
    :model-value="modelValue"
    hide-details
    variant="solo"
    flat
    clearable
    clear-icon="mdi-trash-can-outline"
    autocomplete="off"
    :label="label"
    :placeholder="label"
    single-line
    density="comfortable"
    :menu-props="{
      width: '300'
    }"
    @change="v => $emit('update:modelValue', v)"
  >
    <template #prepend-item>
      <div>
        <v-list-item @click="$refs.select.blur()">
          <div class="d-flex text-primary justify-space-between align-center">
            <span>{{ $t("_.close") }}</span>
            <v-icon class="px-2" color="primary">mdi-close</v-icon>
          </div>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </template>
  </v-select>
  <v-autocomplete
    v-else
    ref="select"
    v-bind="$attrs"
    :items="sortedDataset"
    item-title="label"
    item-value="codename"
    :model-value="modelValue"
    hide-details
    variant="solo"
    flat
    clearable
    clear-icon="mdi-trash-can-outline"
    autocomplete="off"
    :label="label"
    :placeholder="label"
    :menu-props="{
      width: '300'
    }"
    @change="v => $emit('update:modelValue', v)"
    @update:search-input="v => sortDataset(v)"
  >
    <template #prepend-item>
      <div>
        <v-list-item @click="$refs.select.blur()">
          <div class="d-flex text-primary justify-space-between align-center">
            <span>{{ $t("_.close") }}</span>
            <v-icon class="px-2" color="primary">mdi-close</v-icon>
          </div>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
import without from "lodash/without";
import cloneDeep from "lodash/cloneDeep";

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
  data() {
    return {
      sortedDataset: cloneDeep(this.dataset)
    };
  },
  methods: {
    remove(item) {
      const newValue = without(this.modelValue, item.id);
      this.$emit("update:modelValue", newValue);
    },
    sortDataset(input) {
      this.sortedDataset = cloneDeep(this.dataset);
      if (input) {
        this.sortedDataset = this.sortedDataset
          .filter(item =>
            item.label.toLowerCase().includes(input.toLowerCase())
          )
          .toSorted((a, b) => {
            if (
              a.label.toLowerCase().startsWith(input.toLowerCase()) &&
              !b.label.toLowerCase().startsWith(input.toLowerCase())
            )
              return -1;
            else return 1;
          });
      }
    }
  }
};
</script>
