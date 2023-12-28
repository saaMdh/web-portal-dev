<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-select
    v-if="dataset.length <= 20"
    ref="select"
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
    single-line
    density="comfortable"
    :placeholder="label"
    :menu-props="{
      width: '300'
    }"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <template #prepend-item>
      <div>
        <v-list-item @click="$refs.select.blur()">
          <div class="d-flex text-primary">
            <span>{{ $t("_.close") }}</span
            ><v-spacer></v-spacer>
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
    :menu-props="{
      width: '300'
    }"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <template #prepend-item>
      <div>
        <v-list-item @click="$refs.select.blur()">
          <div class="d-flex text-primary">
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
