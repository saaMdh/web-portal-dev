<template>
  <div>
    <v-select
      multiple
      chips
      hint="What are the target regions"
      persistent-hint
      :items="dataset"
      item-title="label"
      item-value="codename"
      :model-value="selection"
      hide-details
      solo
      flat
      clearable
      autocomplete="off"
      :label="label"
      @change="select"
    >
      <template #selection="data">
        <v-chip
          :input-value="data.selected"
          close
          dark
          size="small"
          color="amber"
          @click:close="remove(data.item)"
          >{{ data.item.label }}</v-chip
        >
      </template></v-select
    >
  </div>
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
