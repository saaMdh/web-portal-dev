<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <v-select
    ref="select"
    multiple
    persistent-hint
    :items="dataset"
    item-title="label"
    item-value="codename"
    :model-value="selection"
    hide-details
    variant="solo"
    flat
    clearable
    clear-icon="mdi-trash-can-outline"
    autocomplete="off"
    :menu-props="{
      width: '300'
    }"
    :label="label"
    :placeholder="label"
    single-line
    density="comfortable"
    @update:modelValue="select"
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
    <template #selection="{ index }">
      <span v-if="index == 0"
        >{{ label }} <b>( {{ selection.length }} )</b>
      </span>
    </template>
  </v-select>
</template>

<script>
import filter from "lodash/filter";
import without from "lodash/without";

export default {
  props: {
    label: {
      type: String,
      default: null
    },
    dataset: {
      type: Array,
      default: null
    },
    modelValue: {
      type: String,
      default: null
    },
    codename: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selection: []
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler: "parse"
    }
  },

  methods: {
    parse(value) {
      this.selection = value ? value.split(",") : [];
    },
    emit() {
      this.$emit("update:modelValue", this.selection.join(","));
    },
    select(selection) {
      this.selection = filter(selection);
      this.emit();
    },
    remove(item) {
      this.selection = without(this.selection, item.codename);
      this.emit();
    }
  }
};
</script>
